import ProfileData from "@/components/Profile/ProfileData";


const Page = async({params}) => {
  const { profile_id } =await params;


  
  return (
    <div className="w-full h-full flex  px-6 py-2 text-3xl font-bold">
      <div className="flex w-1/3 h-full p-1">
      <ProfileData profile_id={profile_id} />
      </div>
      <div className="flex w-2/3 h-full p-1"></div>
    </div>
  );
}

export default Page
