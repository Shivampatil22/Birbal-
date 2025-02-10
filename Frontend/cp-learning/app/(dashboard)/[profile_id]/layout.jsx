
import Nav from "@/components/Common/Nav";
import { Separator } from "@/components/ui/separator";



export default async function RootLayout({ children ,params}) {
    const {profile_id}=await params;
  return (
    <div className="w-full flex flex-col   min-h-screen ">
      <Nav profile_id={profile_id} />
      <Separator />
      <div className="flex-grow flex h-screen px-12">{children}</div>
    </div>
  );
}
