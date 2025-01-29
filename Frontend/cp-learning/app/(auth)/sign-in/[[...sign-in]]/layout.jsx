import { Geist, Geist_Mono } from "next/font/google";



export default function AuthLayout({ children }) {
  return (

        <div
          className={"w-full h-screen flex justify-center items-center"}
        >
          {children}

        </div>

  );
}
