
import Nav from "@/components/Common/Nav";
import { Separator } from "@/components/ui/separator";



export default  function RootLayout({ children ,params}) {
  return (
    <div className="w-full flex  min-h-screen ">
      
      <div className="flex-grow flex h-screen px-12">{children}</div>
    </div>
  );
}
