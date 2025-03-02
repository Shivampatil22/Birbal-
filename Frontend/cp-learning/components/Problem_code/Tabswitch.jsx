"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Code } from "lucide-react";
import CodeSection from "./CodeSection";

const tabs = [
  { id: "code", label: "Code" },
  { id: "ai", label: "Bribal" },
];

const Tabswitch = () => {
  const [activeTab, setActiveTab] = useState("code");
  const [filetype, setFiletype] = useState("Cpp");
  const [code, setCode] = useState("Start coding");

  return (
    <div className="w-full flex flex-col bg-[#272727] rounded-tr-lg rounded-tl-lg h-full">
      {/* Tabs List */}
      <div className="flex gap-4 border-b h-11 bg-[#393939] px-2 rounded-tr-lg rounded-tl-lg border-gray-700 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex mx-1 px-3 py-2 transition-colors ${
              activeTab === tab.id ? "text-white font-bold" : "text-gray-400"
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
      </div>

      {/* Tabs Content - Keep Mounted */}
      <div className="relative w-full h-full">
        {/* Code Tab (Always Mounted, but Hidden if Not Active) */}
        <div className={activeTab === "code" ? "block" : "hidden"}>
          <CodeSection
            code={code}
            setCode={setCode}
            filetype={filetype}
            setFiletype={setFiletype}
          />
        </div>

        {/* AI Bot Tab (Always Mounted, but Hidden if Not Active) */}
        <div className={activeTab === "ai" ? "block" : "hidden"}>
          <h3 className="text-lg font-semibold">AI Bot</h3>
          <div className="mt-2 text-gray-300">
            Your AI assistant will go here.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tabswitch;
