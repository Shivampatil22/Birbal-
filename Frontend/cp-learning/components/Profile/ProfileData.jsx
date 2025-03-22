"use client"
import axios from "axios";
import { useEffect, useState } from "react";
import ProfileSideBar from "./ProfileSidebar";
import Summary from "./Summary";
import toast from "react-hot-toast";
import { useBattleStore } from "@/lib/store";
const ProfileData = ({profile_id}) => {
    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(false);
    const analyzeTost = () => toast.success("analysis completed");
    const {setUserInfo}=useBattleStore();

     useEffect(() => {
          getProfileData();
     }, []);



    const getProfileData = async () => {
      const result = await axios.get(
        `http://localhost:3000/api/user/id/${profile_id}`
      );
   
       const user=result.data;
       const {username,current_rating,tags,imageUrl}=user;
       const userInfo={
        username,
        current_rating,
        tags,
        imageUrl
       }
       console.log(userInfo);
      setUserInfo(userInfo);
      setProfile(result.data);
    };

    const analyzeProfile = async () => {
        try {
             setLoading(true);
           const result = await axios.post(
             `http://localhost:3000/api/analyze/${profile.username}`
           );
          
           setProfile(result.data);  
        } catch (error) {
            console.error(error);
            
        }
        finally {
            setLoading(false);
            analyzeTost();
        }
        
    }

  return (
    <>
    
      <div className="flex w-[25%] h-full border-slate-300 p-4  border-solid">
        <ProfileSideBar profile={profile} analyzeProfile={analyzeProfile} loading={loading} />
      </div>
      <div className="flex w-[75%] flex-col p-4  h-full ">
       <Summary summary={profile.summary}></Summary>
      </div>
    </>
  );
}

export default ProfileData
