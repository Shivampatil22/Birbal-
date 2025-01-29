

const Page = async({params}) => {
  const {profile_id}=await params;
  return (
    <div className="w-full h-full text-3xl font-bold">
      Welcome {profile_id}  
    </div>
  )
}

export default Page
