"use client";
import axios from "axios";
import Problem from "./problem";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

const ProblemList = ({ userId }) => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true); // Initially set loading to true

  useEffect(() => {
    getUserProblem();
  }, []);

  const getUserProblem = async () => {
    try {
      const response = await axios.get(`/api/user/problem/suggest/${userId}`);
      const data = await response.data;
      
      setProblems(data);
    } catch (error) {
      console.error("Error fetching problems:", error);
    } finally {
      setLoading(false); // Set loading to false once data is fetched
    }
  };

  const generateProblems = async () => {
    try {
      setLoading(true); // Start loading while generating new problems
      const response = await axios.post(`/api/suggest/${userId}`);
      const data = await response.data;
      console.log(data);
      getUserProblem(); // Fetch problems after generating them
    } catch (error) {
      console.log("Error generating problems:", error);
    } finally {
      setLoading(false); // Set loading to false once generation is complete
    }
  };

  // Show loading spinner until problems are fetched
  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center bg-[#151515]">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-white text-lg font-medium">
            Loading, please wait...
          </p>
        </div>
      </div>
    );
  }

  // If no problems exist, show "Generate Problems" button
  if (problems.no_of_problems === 0) {
    return (
      <div className="w-full flex h-full justify-center items-center">
        <Button
          onClick={() => {
            generateProblems();
          }}
          className="bg-white text-black"
        >
          Generate Problems
        </Button>
      </div>
    );
  }

  // Once problems are fetched, render the problem list
  return (
    <div className="flex w-full h-full flex-col">
      <div className="w-full flex pt-4 pr-8 justify-end items-center">
        <Button
          onClick={() => {
            generateProblems();
          }}
          className="bg-white font-medium text-black"
          variant="outline"
        >
          Generate New Problems
        </Button>
      </div>
      <div className="p-8 flex w-full h-full flex-col space-y-4">
        {problems.suggestedProblems?.map((problem, index) => {
          return <Problem key={index} problem={problem} problemId={problem._id} userId={userId} />;
        })}
      </div>
    </div>
  );
};

export default ProblemList;
