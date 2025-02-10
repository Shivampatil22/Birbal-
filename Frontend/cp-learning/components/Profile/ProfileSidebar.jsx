"use client"

import { getUserInfo } from "@/lib/codeforces";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Summary from "./Summary";

const ProfileSideBar = ({profile,analyzeProfile,loading}) => {
  
  if (!profile.imageUrl) {
    return <div>Loading...</div>;
  }
  return (
    <div className="w-full h-full flex flex-col bg-slate-200 rounded-xl  ">
      <div className="flex w-full h-1/3 flex-col gap-4  p-2">
        <div className="flex w-full h-max mb-2 items-center ">
          <div className="flex w-24 h-24  p-1 bg">
            <Image
              src={profile.imageUrl}
              alt="avatar"
              className=" rounded-full object-cover"
              width={200}
              height={200}
            />
          </div>
          <div>
            <div className="flex flex-col pl-4">
              <div className="flex text-lg font-semibold">
                {profile.username}
              </div>
              <div className="flex text-lg font-semibold">
                Rank : {profile.current_rating}
              </div>
            </div>
          </div>
        </div>
        <Button
          className="text-lg"
          onClick={() => {
            analyzeProfile();
          }}
          disabled={loading}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
          ) : (
            "Analyze"
          )}
        </Button>
        
      </div>
    </div>
  );
}

export default ProfileSideBar
