"use client"

import React from 'react'
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
const Banner = () => {
  return (
    <div className="h-[27rem] w-[full] flex-col  flex">
      <DotLottieReact
        src="https://lottie.host/6e84c706-3e50-4351-9d71-ee4210a3a29c/ptgjulYxc2.lottie"
        loop
        autoplay
        style={{
          width: "100%",
          height: "100%",
        }}
      />
      <div className='font-semibold flex w-full justify-center text-2xl'>Why So Average? Level Up Like a Pro!</div>
    </div>
  );
}

export default Banner
