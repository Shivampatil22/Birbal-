

import ProfileData from "@/components/Profile/ProfileData";
import ProfileSideBar from "@/components/Profile/ProfileSidebar";





const Page = async({params}) => {
  const { profile_id } =await params;
 

  
  return (
    <div className="w-full h-full flex   px-6  text-3xl font-bold">
     <ProfileData profile_id={profile_id} />
    </div>
  );
}

export default Page
