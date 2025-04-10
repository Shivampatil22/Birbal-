import Link from "next/link";
import React from "react";
import SaveButton from "./saveButton";

const tagColors = [
  "bg-red-500",
  "bg-green-500",
  "bg-blue-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-teal-500",
  "bg-orange-500",
];

const Problem = ({ problem ,userId, problemId }) => {
  const { name, rating, contestId, index, tags } = problem;

  return (
    <div className="w-full bg-[#1e1e1e] hover:bg-[#2a2a2a] transition-colors rounded-xl p-4 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between shadow-md border border-[#2c2c2c]">
      {/* Title + Tags */}
      <div className="flex flex-col gap-2">
        <Link href={`problem/${contestId}/${index}`}>
          <span className="text-lg font-semibold text-white hover:underline cursor-pointer">
            {name}
          </span>
        </Link>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span
              key={tag}
              className={`text-xs text-white px-2 py-1 rounded-full ${
                tagColors[i % tagColors.length]
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div className="mt-3 sm:mt-0 flex sm:text-right">
        <span className="text-sm text-yellow-400 font-medium">⭐ {rating}</span>
        <span className="mx-3">
          <SaveButton userId={userId} problemId={problemId} />
        </span>
      </div>
    </div>
  );
};

export default Problem;
