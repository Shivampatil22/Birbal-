"use client"
import axios from 'axios';
import Problem from './problem'
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';


const ProblemList = ({userId}) => {
    const [problems, setProblems] = useState([]);   
    
     useEffect(()=>{

        getUserProblem();
     },[])
    const getUserProblem = async () => {
        const response = await axios.get(`/api/user/problem/suggest/${userId}`);
        const data = await response.data;
        console.log(data)
        setProblems(data);

    }
    const generateProblems = async () => {
        const response = await axios.post(`/api/suggest/${userId}`);
        let data = await response.data;
        console.log(data);
    
    }
  if(problems.no_of_problems==undefined){
    return (
      <div className="w-full flex h-full justify-center items-center ">
        <div className="w-10 h-10 border-2 border-t-transparent border-black rounded-full animate-spin"></div>
      </div>
    );
  }
  if (problems.no_of_problems === 0) {
    return (
      <div className="w-full flex h-full justify-center items-center ">
        <Button
          onClick={() => {
            generateProblems();
          }}
        >
          Generate Problems
        </Button>
      </div>
    );
  }
  return (
    <div className="flex w-full h-full flex-col">
      <div className="w-full flex pt-4 pr-8 justify-end items-center ">
        <Button
          onClick={() => {
            generateProblems();
          }}
        >
          Generate Problems
        </Button>
      </div>
      <div className="p-8 flex w-full h-full flex-col space-y-4">
        {
          problems.suggestedProblems?.map((problem, index) => {
            return (
              <Problem key={index} problem={problem} />
            )
          })
        }
      </div>
    </div>
  );
}

export default ProblemList
