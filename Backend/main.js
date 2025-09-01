const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const scrape_route = require('./routes/scraper_route.js');
const { default: axios } = require('axios');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const BASE_URL = "https://codeforces.com/api";
let totalFetchAttempts = 0;
let successfulFetches = 0;

app.use(cors());
app.use(express.json());
app.use("/api/problem", scrape_route);

let waitingList = [];
let battleRooms = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("findMatch", async ({ userDetails }) => {
    const matchStartTime = Date.now(); // ⏱ Match start time
    try {
      const { username, current_rating, tags } = userDetails;

      const existingIndex = waitingList.findIndex(user => user.username === username);
      if (existingIndex !== -1) {
        waitingList.splice(existingIndex, 1);
      }

      if (waitingList.length > 0) {
        let opponent = {};
        for (let i = 0; i < waitingList.length; i++) {
          let temp = waitingList[i];
          if (Math.abs(current_rating - temp.current_rating) <= 100) {
            opponent = temp;
            waitingList.splice(i, 1);
            break;
          }
        }

        if (opponent.username) {
          let rating_to_play = Math.max(current_rating, opponent.current_rating);
          const uniqueTags = [...new Set([...tags, ...opponent.tags])];
          const randomTag = uniqueTags[Math.floor(Math.random() * uniqueTags.length)];

          totalFetchAttempts++;

          const response = await axios.get(`${BASE_URL}/problemset.problems`, {
            params: { tags: randomTag },
          });

          let problems = response.data.result.problems
            .filter(problem => problem.rating === rating_to_play)
            .slice(0, 100);

          const problemFetchSuccess = problems.length > 0;
          if (problemFetchSuccess) successfulFetches++;

          console.log(`Problem Fetch - Users: ${username} vs ${opponent.username}, Tag: ${randomTag}, Success: ${problemFetchSuccess}`);
          console.log(`Total Attempts: ${totalFetchAttempts}, Successful Fetches: ${successfulFetches}`);

          if (!problemFetchSuccess) throw new Error("No suitable problems found.");

          const problem = problems[Math.floor(Math.random() * problems.length)];

          try {
            await axios.post(
              `https://birbal-nine.vercel.app/api/problem/${problem.contestId}/${problem.index}`,
              { problem }
            );
          } catch (err) {
            console.error("Error saving problem:", err.message);
          }

          const roomId = `battle${socket.id}_${opponent.socketId}`;
          const roomData = {
            player1: { ...userDetails, socketId: socket.id },
            player2: opponent,
            problem,
            roomId
          };
          battleRooms[roomId] = roomData;

          const matchEndTime = Date.now();
          const matchmakingTime = matchEndTime - matchStartTime;
          console.log(`Matchmaking Time: ${matchmakingTime} ms`);

          io.to(opponent.socketId).emit("matchFound", { roomId, opponent: userDetails });
          io.to(socket.id).emit("matchFound", { roomId, opponent });
        } else {
          waitingList.push({ ...userDetails, socketId: socket.id });
          console.log("Waiting List:", waitingList);
        }
      } else {
        waitingList.push({ ...userDetails, socketId: socket.id });
        console.log(`User added to waiting list: ${socket.id}`);
        console.log("Waiting List:", waitingList);
      }
    } catch (err) {
      console.error("Error in findMatch:", err);
      socket.emit("matchError", { message: "Something went wrong finding a match." });
    }
  });

  socket.on("joinRoom", ({ roomId }) => {
    try {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room: ${roomId}`);
    } catch (err) {
      console.error("Error joining room:", err);
    }
  });

  socket.on("getRoomdata", ({ roomId }) => {
    try {
      socket.emit("sentRoomdata", { problem: battleRooms[roomId]?.problem });
    } catch (err) {
      console.error("Error getting room data:", err);
    }
  });

  socket.on("submitResponse", ({ response }) => {
    try {
      socket.emit("saveResponse", { response });
    } catch (err) {
      console.error("Error in submitResponse:", err);
    }
  });

  socket.on("stopFinding", () => {
    try {
      waitingList = waitingList.filter(user => user.socketId !== socket.id);
      console.log(`User stopped searching: ${socket.id}`);
    } catch (err) {
      console.error("Error in stopFinding:", err);
    }
  });

  socket.on("battleDone", ({ roomId, userId }) => {
    try {
      if (battleRooms[roomId]) {
        io.to(roomId).emit("battleWinner", { winner: userId });
        delete battleRooms[roomId];
        console.log(`Battle over. Winner: ${userId}`);
      }
    } catch (err) {
      console.error("Error in battleDone:", err);
    }
  });

  // DRAW OFFER LOGIC
  socket.on("offerDraw", ({ roomId, senderId }) => {
    const room = battleRooms[roomId];
    if (!room) return;

    const opponentSocketId =
      room.player1.socketId === senderId
        ? room.player2.socketId
        : room.player1.socketId;

    io.to(opponentSocketId).emit("drawOfferReceived", { senderId });
  });

  socket.on("respondToDraw", ({ roomId, accepted }) => {
    const room = battleRooms[roomId];
    if (!room) return;

    if (accepted) {
      io.to(roomId).emit("drawAccepted");
      delete battleRooms[roomId];
    } else {
      io.to(roomId).emit("drawDeclined");
    }
  });

  socket.on("disconnect", () => {
    try {
      waitingList = waitingList.filter(user => user.socketId !== socket.id);
      console.log(`User disconnected: ${socket.id}`);
    } catch (err) {
      console.error("Error on disconnect:", err);
    }
  });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
