"use client";

import { useEffect, useState } from "react";
import { Notebook } from "lucide-react";
import { Separator } from "../ui/separator";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import axios from "axios";

const ProblemDescription = ({ contestId, index, contest,problemMeta}) => {
  const [problemData, setProblemData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        // console.log(contestId, index,problemMeta);
        if(contestId === undefined || index === undefined) return;
        const res = await axios.post(
          ` https://birbal-nine.vercel.app/api/problem/${contestId}/${index}`,{problem:problemMeta}
        );
        setProblemData(res.data);
      } catch (error) {
        console.error("Failed to fetch problem data", error);
        setProblemData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [contestId, index]);

  if (loading) {
    return (
      <section className="w-full flex flex-col justify-center items-center min-h-[30vh] h-full">
        <DotLottieReact
          src="https://lottie.host/bfbe6abf-2a1e-4ff6-86f5-da2c25836deb/hxhV0qpZ7S.lottie"
          loop
          autoplay
          style={{
            width: "20rem",
            height: "20rem",
          }}
        />
        <span className="text-white text-lg animate-pulse">
          Srcaping the problem... Might take a while
        </span>
      </section>
    );
  }

  if (!problemData) {
    return (
      <section className="w-full flex justify-center items-center min-h-[30vh]">
        <span className="text-red-400 text-lg">
          Unable to fetch problem data.
        </span>
      </section>
    );
  }

  const {
    name,
    time_limit,
    memory_limit,
    problem_description,
    input_description,
    output_description,
    examples = [],
    explanations = [],
  } = problemData;

  return (
    <section className="w-full flex flex-col flex-1 min-h-full max-h-full bg-[#272727] rounded-lg overflow-y-scroll">
      <div className="w-full min-h-11 items-center flex space-x-1 bg-[#393939] py-2 px-1 ">
        <span className="font-semibold flex items-center pr-3 border-solid border-r-2 border-gray-200">
          <Notebook color="#348ff0" size={20} className="mx-1" /> Description
        </span>
        <span className="px-3 border-solid border-r-2 border-gray-200 font-semibold">
          Time limit : {time_limit || "Unable to fetch time limit"}
        </span>
        <span className="px-3 border-solid border-r-2 border-gray-200 font-semibold">
          Memory limit : {memory_limit || "Unable to fetch memory limit"}
        </span>
      </div>
      <div className="p-4">
        {!contest && (
          <span className="my-4 text-[1.5rem] font-bold ml-1">
            {name || "Unable to fetch problem name"}
          </span>
        )}

        <div>
          {problem_description || "Unable to fetch problem description"}
        </div>

        <div className="flex flex-col w-full my-3 ">
          <span className="text-xl font-semibold">Input description</span>
          <div>{input_description || "Unable to fetch input description"}</div>
        </div>

        <div className="flex flex-col w-full my-3 ">
          <span className="text-xl font-semibold">Output description</span>
          <div>
            {output_description || "Unable to fetch output description"}
          </div>
        </div>

        <div>
          {examples.length === 0 ? (
            <div className="text-gray-400 font-semibold">
              Unable to fetch examples
            </div>
          ) : (
            examples.map(({ input, output }, index) => (
              <div className="flex flex-col w-full my-2" key={index}>
                <span className="font-semibold text-md">
                  Example {index + 1} :
                </span>
                <div className="pl-2 flex w-full my-1 ">
                  <span className="font-semibold mr-3 ">Input :</span>
                  <span className="text-gray-400 font-semibold">
                    {input || "Unable to fetch input"}
                  </span>
                </div>
                <div className="pl-2 flex w-full my-1 ">
                  <span className="font-semibold mr-3 ">Output :</span>
                  <span className="text-gray-400 font-semibold">
                    {output || "Unable to fetch output"}
                  </span>
                </div>
                <div className="pl-2 flex w-full flex-col my-1 ">
                  <span className="font-semibold mr-3 ">Explaination : </span>
                  <span className="text-gray-400 font-semibold">
                    {explanations[index] || "Unable to fetch explanation"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Separator />
      {!contest && (
        <div className="w-full flex p-4 min-h-20 items-center">
          Problem Link -
          <a
            href={`https://codeforces.com/contest/${contestId}/problem/${index}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            https://codeforces.com/contest/{contestId}/problem/{index}
          </a>
        </div>
      )}
    </section>
  );
};

export default ProblemDescription;
