"use client";

import { Clipboard } from "lucide-react";
import { useEffect, useState } from "react";
import { Select } from "./LanguageSelect";
import CodeEditor from "./codeEditor";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import Link from "next/link";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { useBattleStore } from "@/lib/store";

const frameworks = ["Cpp", "Python", "Javascript"];

const CodeSection = ({
  filetype,
  setFiletype,
  code,
  setCode,
  contestId,
  index,
  userId,
  roomId
}) => {
  const { socket } = useBattleStore();
  const notify = () => toast.success("copied");
  const [submitStatus, setSubmitStatus] = useState("none");
  const [showWinnerPopup, setShowWinnerPopup] = useState(false);
  const [winnerId, setWinnerId] = useState(null);

  useEffect(() => {
    socket.on("battleWinner", ({ winner }) => {
      setWinnerId(winner);
      setShowWinnerPopup(true);
    });

    return () => {
      socket.off("battleWinner");
    };
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      notify();
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const checkSubmission = async () => {
    try {
      setSubmitStatus("loading");

      let result = await axios.get(
        `http://localhost:3000/api/user/id/${userId}/problem`
      );

      result = result.data;

      if (result.contestId == contestId && result.index == index) {
        if (result.verdict === "WRONG_ANSWER") {
          setSubmitStatus("wrong");
        } else {
          setSubmitStatus("correct");
          socket.emit("battleDone", { roomId, userId });
        }
      } else {
        setSubmitStatus("not_submitted");
      }
    } catch (error) {
      console.error("Error checking submission:", error);
      toast.error("Failed to check submission");
      setSubmitStatus("not_submitted");
    }
  };

  return (
    <section className="w-full flex flex-col flex-1 min-h-full bg-[#272727] rounded-lg ml-2 ">
      <div className="flex w-full justify-between mt-3 pr-6">
        <Select
          data={frameworks}
          value={filetype}
          setValue={setFiletype}
          type={"cpp"}
        />
        <button className="flex" onClick={copyToClipboard}>
          <Clipboard /> Copy
        </button>
      </div>

      <CodeEditor filetype={filetype} code={code} setCode={setCode} />

      <div className="flex px-5 w-full h-[3rem] items-center justify-between">
        <div className="flex w-full items-center justify-center h-full">
          {submitStatus === "loading" && (
            <div className="lds-spinner">
              {[...Array(12)].map((_, i) => (
                <div key={i}></div>
              ))}
            </div>
          )}
          {submitStatus === "not_submitted" && (
            <span className="text-xl font-semibold bg-[#393939] flex w-full h-[90%] items-center justify-center">
              Problem not submitted
            </span>
          )}
          {submitStatus === "wrong" && (
            <span className="text-red-500 text-xl font-semibold bg-[#393939] flex w-full h-[90%] items-center justify-center">
              Wrong Answer
            </span>
          )}
          {submitStatus === "correct" && (
            <span className="text-green-500 text-xl font-semibold bg-[#393939] flex w-full h-[90%] items-center justify-center">
              Accepted
            </span>
          )}
        </div>
        <div className="w-max flex">
          <a
            href={`https://codeforces.com/contest/${contestId}/submit`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="mx-3 bg-gray-600">Submit</Button>
          </a>
          <Button className="mx-3 bg-green-500" onClick={checkSubmission}>
            Check Submission
          </Button>
        </div>
      </div>

      {/* Winner/Loser Popup */}
      {showWinnerPopup && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 text-center shadow-xl w-[90%] max-w-md space-y-4">
            <h2 className="text-2xl font-bold text-green-600 flex justify-center items-center space-x-2">
              {winnerId === userId ? (
                <>
                  <span>🏆</span>
                  <span>You Won!</span>
                </>
              ) : (
                <>
                  <span className="text-red-500">❌</span>
                  <span className="text-red-500">You Lost!</span>
                </>
              )}
            </h2>

            <p className="text-gray-700 text-lg">
              {winnerId === userId
                ? "Congratulations! Your solution was accepted."
                : "Better luck next time!"}
            </p>

            <Link href="/profile/userId">
              <Button className="bg-green-500 w-full text-white">
                Go to Profile
              </Button>
            </Link>
          </div>
        </div>
      )}

    </section>
  );
};

export default CodeSection;
