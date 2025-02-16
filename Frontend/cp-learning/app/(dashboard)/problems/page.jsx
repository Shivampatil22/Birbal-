
import ProblemList from "@/components/Problems/problemList";
import { auth } from "@clerk/nextjs/server";

const ProblemsPage = async() => {
   const { userId } = await auth();
  return (
    <div className="flex w-full h-[91vh] ">
     <ProblemList userId={userId}></ProblemList>
    </div>
  )
}

export default ProblemsPage