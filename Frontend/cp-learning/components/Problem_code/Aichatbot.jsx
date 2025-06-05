"use client";
import { useState } from "react";
import { Jarvis } from "./../../lib/AiBot";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
const Aichatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const aiResponse = await Jarvis(input);
      const aiMsg = { role: "ai", text: aiResponse };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Something went wrong. Try again." },
      ]);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">AI Chatbot</h1>
      <div className="bg-gray-100 p-4 rounded mb-4 h-[19rem] overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-4 ${msg.role === "user" ? "text-blue-600" : "text-green-700"}`}>
          <strong>{msg.role === "user" ? "You" : "AI"}:</strong>
          <div className="mt-1 p-2 bg-white rounded prose prose-sm max-w-none">
            <ReactMarkdown
              children={msg.text}
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            />
          </div>
        </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border border-gray-300 rounded px-3 py-2 text-black"
          placeholder="Ask something..."
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Aichatbot;
