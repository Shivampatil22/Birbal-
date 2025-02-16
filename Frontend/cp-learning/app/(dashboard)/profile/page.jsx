

import ProfileData from "@/components/Profile/ProfileData";
import { auth } from "@clerk/nextjs/server";




const Page = async() => {
 
    const { userId } = await auth();

  
  return (
    <div className="w-full h-full flex   px-6  text-3xl font-bold">
     <ProfileData profile_id={userId} />
    </div>
  );
}

export default Page
