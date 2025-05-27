'use client';
import Problem from '../../../../components/Problems/problem';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

const page = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  // console.log(userId)
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchSavedProblems = async () => {
      try {
        const res = await axios.get(`/api/user/${userId}/save`);
         setProblems(res.data);
      } catch (error) {
        console.error("Error fetching saved problems:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedProblems();
  }, [userId]);

  if (loading) return <div className="text-white p-4">Loading...</div>;

  return (
    <div className="p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">Saved Problems</h1>
      {problems.length === 0 ? (
        <p>No saved problems.</p>
      ) : (
        <ul className="space-y-4">
          {problems?.map((problem,index) => {
          return <Problem key={index} problem={problem} problemId={problem._id} userId={userId} />;
        })}
        </ul>
      )}
    </div>

  )
}

export default page