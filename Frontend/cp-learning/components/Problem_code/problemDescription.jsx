
import { Notebook } from "lucide-react";
import { Separator } from "../ui/separator";
const ProblemDescription = ({problemData,contestId,index}) => {
      const {
        problem_name,
        time_limit,
        memory_limit,
        problem_description,
        input_description,
        output_description,
        examples,
        explanations,
      } = problemData;
  return (
    <section className="w-full flex flex-col flex-1 min-h-full max-h-full bg-[#272727] rounded-lg overflow-y-scroll">
      <div className="w-full min-h-11 items-center flex space-x-1 bg-[#393939] py-2 px-1 ">
        <span className="font-semibold flex items-center pr-3 border-solid border-r-2 border-gray-200">
          <Notebook color="#348ff0" size={20} className="mx-1" /> Description
        </span>
        <span className="px-3 border-solid border-r-2 border-gray-200 font-semibold">
          Time limit : {time_limit}
        </span>
        <span className="px-3 border-solid border-r-2 border-gray-200 font-semibold">
          Memory limit : {memory_limit}
        </span>
      </div>
      <div className="p-4">
        <span className="my-2 text-[1.5rem] font-bold ml-1">
          {problem_name}
        </span>
        <div>{problem_description}</div>
        <div className="flex flex-col w-full my-3 ">
          <span className="text-xl font-semibold">Input description</span>
          <div>{input_description}</div>
        </div>
        <div className="flex flex-col w-full my-3 ">
          <span className="text-xl font-semibold">Output description</span>
          <div>{output_description}</div>
        </div>
        <div>
          {examples.map(({ input, output }, index) => {
            return (
              <div className="flex flex-col w-full my-2" key={index}>
                <span className="font-semibold text-md">
                  Example {index + 1} :
                </span>
                <div className="pl-2 flex w-full my-1 ">
                  <span className="font-semibold mr-3 ">Input :</span>
                  <span className="text-gray-400 font-semibold">{input}</span>
                </div>
                <div className="pl-2 flex w-full my-1 ">
                  <span className="font-semibold mr-3 ">Output :</span>
                  <span className="text-gray-400 font-semibold">{output}</span>
                </div>
                <div className="pl-2 flex w-full flex-col my-1 ">
                  <span className="font-semibold mr-3 ">Explaination : </span>
                  <span className="text-gray-400 font-semibold">
                    {explanations[index]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Separator />
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
    </section>
  );
}

export default ProblemDescription
