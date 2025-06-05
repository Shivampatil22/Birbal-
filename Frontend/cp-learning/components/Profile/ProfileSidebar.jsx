"use client";

import { getUserInfo } from "@/lib/codeforces";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Summary from "./Summary";
import Link from "next/link";
import { Separator } from "../ui/separator";

const ProfileSideBar = ({ profile, analyzeProfile, loading }) => {
  if (!profile.imageUrl) {
    return (
      <div className="flex w-full h-full justify-center items-center">
        <div className="w-10 h-10 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  // console.log(profile.userId)
  return (
    <div className="w-full h-full flex flex-col bg-[#1F1F1F] text-white rounded-xl p-4">
      <div className="flex w-full h-1/3 flex-col gap-4 p-2">
        <div className="flex w-full h-max mb-4 items-center">
          <div className="w-24 h-24 p-1 rounded-full">
            <Image
              src={profile.imageUrl}
              alt="avatar"
              className="rounded-full object-cover"
              width={200}
              height={200}
            />
          </div>
          <div className="pl-4">
            <div className="text-xl font-semibold">{profile.username}</div>
            <div className="text-lg">Rank: {profile.current_rating}</div>
          </div>
        </div>
        <Button
          className="w-full text-lg py-2"
          onClick={() => analyzeProfile()}
          disabled={loading}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
          ) : (
            "Analyze"
          )}
        </Button>
      </div>
      <Separator/>
      {/* Links for "Solved Problems" and "Contest History" */}
      <div className="flex flex-col gap-4 mt-6 w-full items-center">
        <Link
          href={`/id/saved-problems?userId=${profile.userId}`}
          className="text-lg text-white bg-[#151515] hover:bg-white w-full hover:text-black  rounded-lg px-4 py-2 text-center transition duration-200"
        >
          Saved Problems
        </Link>
        <Link
          href="/id/contest-history"
          className="text-lg text-white bg-[#151515] hover:bg-white w-full hover:text-black  rounded-lg px-4 py-2 text-center transition duration-200"
        >
          Contest History
        </Link>
      </div>
    </div>
  );
};

export default ProfileSideBar;
