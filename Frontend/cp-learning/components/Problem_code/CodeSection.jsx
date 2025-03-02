"use client"

import { Clipboard, Code } from "lucide-react";
import { useState } from "react";
import { Select } from "./LanguageSelect";
import CodeEditor from "./codeEditor";
import toast from "react-hot-toast";

const frameworks = ["Cpp","Python","Javascript"];
const CodeSection = ({filetype,setFiletype,code,setCode}) => {

 
  const notify = () => toast.success("copied");
  
  // Function to copy code to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      notify();
    } catch (err) {
      console.error("Failed to copy:", err);
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
        onClick={()=>{
          copyToClipboard();
        }}>
          <Clipboard/> Copy
        </button>
      </div>
      <CodeEditor filetype={filetype} code={code} setCode={setCode} />
    </section>
  );
};

export default CodeSection;
