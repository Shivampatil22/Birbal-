import Link from 'next/link';
import React from 'react'

const Problem = ({problem}) => {
  const {name,rating,contestId,index} = problem;
  return (
    <div className="flex w-full min-h-20 bg-slate-100 rounded-lg p-2 px-5 justify-between items-center">
      <Link href={`problem/${contestId}/${index}`}>
        <span> {name}</span>
      </Link>
      <span>{rating} </span>
    </div>
  );
}

export default Problem
