import Banner from "@/components/Common/Banner";
import { Geist, Geist_Mono } from "next/font/google";



export default function AuthLayout({ children }) {
  return (
    <div className={"w-full h-screen flex  bg-[#151515] text-white "}>
      <div className="w-1/2 flex flex-col h-full items-center p-14">
        <Banner />
      </div>
      <div className="w-1/2 flex h-full flex-col items-center">
        <div className="text-[3rem] font-bold mt-10 mb-4">Birbal</div>
        {children}
      </div>
    </div>
  );
}
