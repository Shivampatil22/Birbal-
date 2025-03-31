import RoomComp from "@/components/Contest/TempRoom";


const RoomPage = async({ params }) => {
  const { roomid } = await params;


  return (
    <RoomComp roomid={roomid}></RoomComp>
  );
};

export default RoomPage;
