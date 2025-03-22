"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useBattleStore } from "@/lib/store";
import FindMatchButton from "@/components/Contest/FindMatchButton";

const ContestPage = () => {
  const { socket, connectSocket, roomId } = useBattleStore();
  const [isFinding, setIsFinding] = useState(false);
  const router = useRouter();

  // Connect socket only once
  useEffect(() => {
    connectSocket();
  }, []);

  // Redirect when match is found
  useEffect(() => {
    if (roomId) {
      console.log(`Redirecting to /contest/${roomId}`);
      setIsFinding(false);
      router.push(`/contest/${roomId}`);
    }
  }, [roomId]);

  if (!socket) return <div>Loading...</div>;

  return (
    <div className="w-full min-h-[92vh] flex justify-center items-center">
      <FindMatchButton
        socket={socket}
        isFinding={isFinding}
        setIsFinding={setIsFinding}
      />
    </div>
  );
};

export default ContestPage;
