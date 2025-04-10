"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useBattleStore } from "@/lib/store";
import { motion } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Image from "next/image";
import FindMatchButton from "@/components/Contest/FindMatchButton"; // Import the FindMatchButton component

const ContestPage = () => {
  const { socket, connectSocket, roomData, userInfo } = useBattleStore();
  const [isFinding, setIsFinding] = useState(false);
  const [opponentFound, setOpponentFound] = useState(false);
  const router = useRouter();
  const { roomId,opponent } = roomData; // Extract roomId from roomData

  // Dummy player & opponent data
  // const player = {
  //   username: "ShivamPatil",
  //   imageUrl: "/avatar1.png",
  // };
  // const opponent = {
  //   username: "CodeMaster",
  //   imageUrl: "/avatar2.png",
  // };

  // Connect socket only once
  useEffect(() => {
    console.log(userInfo);
    connectSocket();
  }, []);

  // Redirect when match is found
  useEffect(() => {
    if (roomId) {
      setIsFinding(false);
      setOpponentFound(true); // Set opponentFound to true when a roomId is available
      router.push(`/contest/${roomId}`);
    }
  }, [roomId]);

  if (!socket) return <div>Loading...</div>;

  return (
    <div className="w-full min-h-[92vh] flex flex-col justify-center items-center bg-[#0f0f0f] text-white">
      {!opponentFound ? (
        <>
          {/* Display Find Match Button only if isFinding is true */}
          {isFinding ? (
            <>
              <DotLottieReact
                src="https://lottie.host/eb536513-3b4d-4680-9df4-9a1402d0e1a4/Xzc7DJs81T.lottie"
                loop
                autoplay
                style={{
                  width: "20rem",
                  height: "20rem",
                }}
              />
              <p className="mt-4 text-2xl font-semibold animate-pulse">
                Finding your worthy opponent...
              </p>
            </>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-6 p-4 bg-[#1e1e1e] rounded-xl shadow-lg flex flex-col items-center"
              >
                <Image
                  src={userInfo?.imageUrl}
                  alt="Player Avatar"
                  width={200}
                  height={200}
                  className="rounded-full w-[6rem] h-[6rem] object-fill border-4 border-blue-500"
                />
                <p className="mt-2 text-xl">{userInfo?.username}</p>
              </motion.div>

              {/* The Find Match button */}
            </>
          )}
          <FindMatchButton
            socket={socket}
            isFinding={isFinding}
            setIsFinding={setIsFinding}
          />
        </>
      ) : (
        <>
          <div className="flex items-center gap-12">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-[#1e1e1e] p-4 rounded-xl shadow-lg flex flex-col items-center"
            >
              <Image
                src={userInfo.imageUrl}
                alt="Player"
                width={100}
                height={100}
                className="rounded-full border-4 border-blue-500"
              />
              <p className="mt-2 text-xl">{userInfo.username}</p>
            </motion.div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold text-green-400"
            >
              VS
            </motion.div>

            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-[#1e1e1e] p-4 rounded-xl shadow-lg flex flex-col items-center"
            >
              <Image
                src={opponent.imageUrl}
                alt="Opponent"
                width={100}
                height={100}
                className="rounded-full border-4 border-red-500"
              />
              <p className="mt-2 text-xl">{opponent.username}</p>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 text-3xl font-semibold text-yellow-300 animate-bounce"
          >
            Match Found!
          </motion.p>
        </>
      )}
    </div>
  );
};

export default ContestPage;
