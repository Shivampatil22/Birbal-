import CodeEditor from "@/components/Problem_code/codeEditor";
import CodeSection from "@/components/Problem_code/CodeSection";
import ProblemDescription from "@/components/Problem_code/problemDescription";
import Tabswitch from "@/components/Problem_code/Tabswitch";



import { auth } from "@clerk/nextjs/server";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";




const page =async ({params}) => {
    const {contestId, index} =await  params;
    const { userId } = await auth()
    
    const problemData = {
      problem_name: "A. Cut Ribbon",
      time_limit: "1 second",
      memory_limit: "256 megabytes",
      problem_description:
        "Polycarpus has a ribbon, its length is n. He wants to cut the ribbon in a way that fulfils the following two conditions: After the cutting each ribbon piece should have length a, b or c. After the cutting the number of ribbon pieces should be maximum. Help Polycarpus and find the number of ribbon pieces after the required cutting.",
      input_description:
        "The first line contains four space-separated integers n, a, b and c (1 ≤ n, a, b, c ≤ 4000) — the length of the original ribbon and the acceptable lengths of the ribbon pieces after the cutting, correspondingly. The numbers a, b and c can coincide.",
      output_description:
        "Print a single number — the maximum possible number of ribbon pieces. It is guaranteed that at least one correct ribbon cutting exists.",
      examples: [
        { input: "5 5 3 2", output: "2" },
        { input: "7 5 5 2", output: "2" },
      ],
      explanations: [
        "In the first example Polycarpus can cut the ribbon in such way: the first piece has length 2, the second piece has length 3.",
        "In the second example Polycarpus can cut the ribbon in such way: the first piece has length 5, the second piece has length 2.",
      ],
    };
    const {
      problem_name,
      time_limit,
      memory_limit,
      problem_description,
      input_description,
      output_description,
      examples,
      explanations
    } = problemData;
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="w-full min-h-[91.5vh] max-h-[91.5vh] flex bg-[#151515] p-3 text-white"
    >
      <ResizablePanel defaultSize={50}>
        <ProblemDescription problemData={problemData} contestId={contestId} index={index} />
        
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <Tabswitch contestId={contestId} index={index} userId={userId}/>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export default page
