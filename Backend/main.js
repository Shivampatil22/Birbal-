const express = require('express');
const cors = require('cors');
const http = require('http');  // Required for Socket.io
const { Server } = require('socket.io');
const scrape_route = require('./routes/scraper_route.js');
const { default: axios } = require('axios');

const app = express();
const server = http.createServer(app);  // Create HTTP server
const io = new Server(server, {
    cors: {
        origin: "*",
        // methods: ["GET", "POST"]
    }
});


const BASE_URL ="https://codeforces.com/api"
// Middleware
app.use(cors());
app.use(express.json());

// REST API route
app.use("/api/problem", scrape_route);

// Store waiting users and active battles
let waitingList = [];
let battleRooms = {};

// Socket.io logic
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // User presses "Find Match"
    socket.on("findMatch", async({ userDetails }) => {
        const { username, current_rating, tags } = userDetails
        if (waitingList.length > 0) {
            // Match user with an opponent
            // let opponent = waitingList.shift();
            let opponent = {}
          
            for (let i = 0; waitingList.length > i; i++) {
                let temp = waitingList[i];
                if (Math.abs(current_rating - temp.current_rating) <= 100) {
                    opponent=temp;
                    console.log(opponent)
                    waitingList.splice(i, 1);
                    socket.emit("matchFound",{opponent});
                    break;
                }
               
            }
            if (opponent) {
                let rating_to_play=Math.max(current_rating,opponent.current_rating);

                const uniqueTags = [...new Set([...tags, ...opponent.tags])];
                // Select a random tag
                const randomTag = uniqueTags[Math.floor(Math.random() * uniqueTags.length)];
                const response = await axios.get(`${BASE_URL}/problemset.problems`, {
                    params: { tags: randomTag },
                });
                
                const problems = response.data.result.problems
                    .filter(problem =>
                        problem.rating == rating_to_play
                    )
                    .slice(0, 100); // Get only 100 problems per tag
                
                const problem = problems[Math.floor(Math.random() * problems.length)]
                const roomData={
                    player1:userDetails,
                    player2:opponent,
                    problem:problem
                }
                console.log(roomData);
                const roomId=`battle${socket.id}_${opponent.socketId}`
                battleRooms[roomId]=roomData;

                // Make both players join the room
                // socket.join(roomId);
                io.to(opponent.socketId).emit("matchFound", { roomId });
                io.to(socket.id).emit("matchFound", { roomId });
               
            }
            else{
                waitingList.push(userDetails);
                console.log(waitingList);
            }
            // let roomId = `battle_${socket.id}_${opponent.id}`;

            // // Store room data
            // battleRooms[roomId] = { player1: socket.id, player2: opponent.id };

            // // Join room and notify both users
            // socket.join(roomId);
            // opponent.join(roomId);
            // io.to(roomId).emit("matchFound", { roomId, players: [socket.id, opponent.id] });
         
        } else {
            // No opponent available, add user to waiting list
            waitingList.push(userDetails);
            console.log(`User added to waiing list: ${socket.id}`);
            console.log(waitingList);
        }
    });

    socket.on("joinRoom", ({ roomId }) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room: ${roomId}`);
        socket.emit("getRoomdata",{roomData:battleRooms[roomId]});
    });


    socket.on("submitResponse",({response})=>{
        socket.emit("saveResponse",{response})
    })
    
    // User presses "Stop Finding"
    socket.on("stopFinding", () => {
        console.log(socket.id);
        waitingList = waitingList.filter((user) => user.socketId != socket.id);
        console.log(`User stopped searching: ${socket.id}`);
        console.log(waitingList);
    });

    // Handling the battle completion
    socket.on("battleDone", ({ roomId, userId }) => {
        if (battleRooms[roomId]) {
            io.to(roomId).emit("battleWinner", { winner: userId });
            delete battleRooms[roomId];  // Remove room after battle ends
            console.log(`Battle over. Winner: ${userId}`);
        }
    });

    // Handle disconnects
    socket.on("disconnect", () => {
        waitingList = waitingList.filter(user => user.socketid !== socket.id);
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Start the server
const PORT = 8000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
