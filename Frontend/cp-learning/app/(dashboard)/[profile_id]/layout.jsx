
import Nav from "@/components/Common/Nav";
import { Separator } from "@/components/ui/separator";



export default async function RootLayout({ children ,params}) {
    const {profile_id}=await params;
  return (
     <div className="w-full ">
        <Nav  profile_id={profile_id}/>
        <Separator/>
        {children}
     </div>
  );
}
