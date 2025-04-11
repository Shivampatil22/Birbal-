import RoomComp from "@/components/Contest/TempRoom";
import { auth } from "@clerk/nextjs/server";


const RoomPage = async({ params }) => {
  const { roomid } = await params;
  const { userId } = await auth();


  return (
    <RoomComp roomid={roomid} userId={userId}></RoomComp>
  );
};

export default RoomPage;
