
"use client";

import { useState } from "react";
import axios from "axios";
import { Bookmark } from "lucide-react";
import { useBattleStore } from "@/lib/store";

const SaveButton = ({ problemId, userId }) => {
  const { userInfo } = useBattleStore();
  const { favourite_problems: favouriteProblems } = userInfo;
  const [isSaved, setIsSaved] = useState(favouriteProblems.includes(problemId));
  const [loading, setLoading] = useState(false);

  const toggleFavourite = async () => {
    try {
      setLoading(true);
      const res = await axios.patch(
       `https://birbal-nine.vercel.app/api/user/${userId}/save/${problemId}`
      );
      if (res.status === 200) {
        setIsSaved((prev) => !prev);
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavourite}
      disabled={loading}
      className="p-1 rounded-md transition"
    >
      <Bookmark
        size={20}
        className={isSaved ? "text-yellow-400 fill-yellow-400" : "text-white"}
      />
    </button>
  );
};

export default SaveButton;


