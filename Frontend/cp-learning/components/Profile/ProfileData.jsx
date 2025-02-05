"use client"

import { getUserInfo } from "@/lib/codeforces";
import { useEffect, useState } from "react";

const ProfileData = ({profile_id}) => {
    const [profile, setProfile] = useState({});
    
    useEffect(() => {
        getProfileData();
    }, []);
    const getProfileData = async()=>{
       const result=await getUserInfo(profile_id);    
       console.log(result);
    }
  return (
    <div>
      helo
    </div>
  )
}

export default ProfileData
