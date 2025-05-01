"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Bot, Code, Handshake } from "lucide-react";
import CodeSection from "./CodeSection";
import { useBattleStore } from "@/lib/store";
import { toast } from "react-hot-toast";

const Tabswitch = ({ contestId, index, userId, contest, roomId }) => {
  const { socket } = useBattleStore();
  const router = useRouter();

  const availableTabs = contest
    ? [{ id: "code", label: "Code" }]
    : [
      { id: "code", label: "Code" },
      { id: "ai", label: "Birbal" },
    ];

  const [activeTab, setActiveTab] = useState("code");
  const [filetype, setFiletype] = useState("Cpp");
  const [code, setCode] = useState("Start coding");

  const [drawOfferReceived, setDrawOfferReceived] = useState(false);
  const [drawSender, setDrawSender] = useState(null);
  const [drawAccepted, setDrawAccepted] = useState(false);
  const [drawDeclined, setDrawDeclined] = useState(false);

  const handleOfferDraw = () => {
    socket.emit("offerDraw", { roomId, senderId: socket.id });

    toast("Draw offer sent");
  };

  const handleDrawResponse = (accepted) => {
    socket.emit("respondToDraw", { roomId, accepted });
    setDrawOfferReceived(false);
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("drawOfferReceived", ({ senderId }) => {
      setDrawOfferReceived(true);
      setDrawSender(senderId);
    });

    socket.on("drawAccepted", () => {
      setDrawAccepted(true);
      toast("Draw accepted. The contest ended in a draw.");
      const store = useBattleStore.getState();
      store.setRoomData({});
      store.problem = {};
    });

    socket.on("drawDeclined", () => {
      setDrawDeclined(true);
      toast("Draw declined.");
      setTimeout(() => setDrawDeclined(false), 4000);
    });

    return () => {
      socket.off("drawOfferReceived");
      socket.off("drawAccepted");
      socket.off("drawDeclined");
    };
  }, [socket]);

  return (
    <div className="w-full flex flex-col bg-[#272727] rounded-tr-lg rounded-tl-lg h-full">
      {/* Tabs List */}
      <div className="flex gap-4 border-b h-11 bg-[#393939] px-2 rounded-tr-lg rounded-tl-lg border-gray-700 pb-2">
        {availableTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex mx-1 px-3 py-2 transition-colors ${activeTab === tab.id ? "text-white font-bold" : "text-gray-400"
              }`}
          >
            {tab.id === "code" ? (
              <Code className="mx-1" color="#2ee65f" />
            ) : (
              <Bot className="mx-1" color="#2443f2" />
            )}
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="underline"
                className="absolute bottom-0 left-0 w-full h-1 bg-blue-500"
              />
            )}
          </button>
        ))}

        {/* Offer Draw Button */}
        {contest && (
          <button
            onClick={handleOfferDraw}
            className="ml-auto flex items-center gap-1 bg-yellow-500 text-black px-3 py-1 rounded hover:bg-yellow-600"
          >
            <Handshake size={16} />
            Offer Draw
          </button>
        )}
      </div>

      {/* Tabs Content */}
      <div className="relative w-full h-full">
        {activeTab === "code" && (
          <CodeSection
            code={code}
            setCode={setCode}
            filetype={filetype}
            setFiletype={setFiletype}
            contestId={contestId}
            index={index}
            userId={userId}
            roomId={roomId}
          />
        )}

        {!contest && activeTab === "ai" && (
          <div>
            <h3 className="text-lg font-semibold">AI Bot</h3>
            <div className="mt-2 text-gray-300">
              Your AI assistant will go here.
            </div>
          </div>
        )}
      </div>

      {/* Draw Offer Received Modal */}
      {drawOfferReceived && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 text-black w-[300px]">
            <h2 className="text-lg font-bold mb-2">Draw Offer</h2>
            <p className="mb-4">Your opponent offered a draw.</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => handleDrawResponse(false)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Decline
              </button>
              <button
                onClick={() => handleDrawResponse(true)}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Draw Accepted Modal */}
      {drawAccepted && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 text-black w-[320px] text-center">
            <h2 className="text-xl font-bold mb-2">Draw Accepted</h2>
            <p className="mb-4">The contest ended in a draw.</p>
            <button
              onClick={() => router.push("/profile/userId")}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Go to Contest Page
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tabswitch;
