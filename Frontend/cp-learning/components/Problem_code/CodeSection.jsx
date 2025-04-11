"use client";

import { Clipboard, Code } from "lucide-react";
import { useState } from "react";
import { Select } from "./LanguageSelect";
import CodeEditor from "./codeEditor";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import Link from "next/link";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

const frameworks = ["Cpp", "Python", "Javascript"];
const CodeSection = ({
  filetype,
  setFiletype,
  code,
  setCode,
  contestId,
  index,
  userId
 
}) => {
  const notify = () => toast.success("copied");
  const [submitStatus, setSubmitStatus] = useState("none");

  // Function to copy code to clipboard
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
    console.log(userId);
    setSubmitStatus("loading");

    let result = await axios.get(
      `http://localhost:3000/api/user/id/${userId}/problem`
    );

    result = result.data;
    console.log(result);

    if (result.contestId == contestId && result.index == index) {
      if (result.verdict == "WRONG_ANSWER") {
        setSubmitStatus("wrong");
      } else {
        console.log("ok");
        setSubmitStatus("correct");
      }
    } else {
      setSubmitStatus("not_submitted"); // only if it doesn't match
    }
  } catch (error) {
    console.error("Error checking submission:", error);
    toast.error("Failed to check submission");
    setSubmitStatus("not_submitted");
  }
};


  return (
    <section className="w-full flex flex-col flex-1 min-h-full bg-[#272727]  rounded-lg ml-2 ">
      <div className="flex w-full  justify-between mt-3 pr-6">
        <Select
          data={frameworks}
          value={filetype}
          setValue={setFiletype}
          type={"cpp"}
        />
        <button
          className="flex "
          onClick={() => {
            copyToClipboard();
          }}
        >
          <Clipboard /> Copy
        </button>
      </div>
      <CodeEditor filetype={filetype} code={code} setCode={setCode} />
      <div className="flex px-5 w-full  h-[3rem] items-center justify-between">
        <div className="flex w-full items-center justify-center h-full">
          {submitStatus === "loading" && (
            <>
              <div className="lds-spinner">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </>
          )}
          {submitStatus == "not_submitted" && (
            <span className="text-xl font-semibold bg-[#393939] flex w-full h-[90%] items-center   justify-center ">
              Problem not submitted
            </span>
          )}
          {submitStatus == "wrong" && (
            <span className="text-red-500  text-xl font-semibold bg-[#393939] flex w-full h-[90%] items-center   justify-center">
              Wrong Answer
            </span>
          )}
          {submitStatus == "correct" && (
            <span className="text-green-500 text-xl font-semibold bg-[#393939] flex w-full h-[90%] items-center   justify-center">
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

          <Button
            className="mx-3 bg-green-500"
            onClick={() => {
              checkSubmission();
            }}
          >
            Check Submission
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CodeSection;
