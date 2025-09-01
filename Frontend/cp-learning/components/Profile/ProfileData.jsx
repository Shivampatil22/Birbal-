"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import ProfileSideBar from "./ProfileSidebar";
import Summary from "./Summary";
import toast from "react-hot-toast";
import { useBattleStore } from "@/lib/store";
import { Bar } from "react-chartjs-2";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Register necessary chart elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ProfileData = ({ profile_id }) => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true); // Loading state
  const [solvedQuestionsData,setSolvedQuestionsData] = useState({});
  const analyzeTost = () => toast.success("Analysis completed");
  const { setUserInfo } = useBattleStore();

  // Dummy Data for solved questions
  // const solvedQuestionsData = {
  //   solvedCount: 120,
  //   ratingDistribution: [
  //     5, 12, 18, 25, 15, 10, 8, 4, 6, 7, 3, 2, 1, 0, 1, 0, 2, 3, 4, 5,
  //   ], // Mock data for rating distribution (5 problems in 1100-1200, 12 in 1200-1300, etc.)
  //   tagsDistribution: {
  //     "Dynamic Programming": 25,
  //     Greedy: 30,
  //     Graph: 15,
  //     Math: 20,
  //     Trees: 10,
  //   },
  // };

  // Function to generate the rating intervals from 1100 to 2000
  const generateRatingIntervals = () => {
    const intervals = [];
    for (let i = 800; i <= 2000; i += 100) {
      intervals.push(`${i}`);
    }
    return intervals;
  };

  useEffect(() => {
    getProfileData();
  }, []);

  const getProfileData = async () => {
    const result = await axios.get(
      `NEXT_PUBLIC_FRONTEND_URL/api/user/id/${profile_id}`
    );

    const userDetails = result.data;
    const {user}=userDetails;
    const { username, current_rating, tags, imageUrl, favourite_problems } =
      user;
    const userInfo = {
      username,
      current_rating,
      tags,
      imageUrl,
      favourite_problems,
    };
    
    setUserInfo(userInfo);
    setSolvedQuestionsData(userDetails.solved_problem_analysis);
    setProfile(user);
    setLoading(false); 
  };

  const analyzeProfile = async () => {
    try {
      setLoading(true);
      const result = await axios.post(
        `NEXT_PUBLIC_FRONTEND_URL/api/analyze/${profile.username}`
      );

      setProfile(result.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      analyzeTost();
    }
  };

  return (
    <>
      <div className="flex w-[25%] h-full border-slate-300 p-4 border-solid">
        <ProfileSideBar
          profile={profile}
          analyzeProfile={analyzeProfile}
          loading={loading}
        />
      </div>
      <div className="flex w-[75%] flex-col p-4 h-full bg-[#151515]">
        {/* Loading effect when profile data is being fetched */}
        {loading ? (
          <div className="flex w-full justify-center items-center h-full bg-black bg-opacity-50">
            <div className="flex items-center">
              <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin border-t-transparent"></div>
              <p className="text-white ml-6 text-2xl font-semibold animate-pulse">
                fetching the data... hang tight!
              </p>
            </div>
          </div>
        ) : (
          <>
            <Summary summary={profile.summary} />

            {/* Solved Questions Counter */}
            <div className="text-white mt-6 text-xl font-semibold">
              Questions Solved: {solvedQuestionsData.solvedCount}
            </div>

            {/* Check if there are no solved problems */}
            {solvedQuestionsData.solvedCount === 0 ? (
              <div className="text-white mt-6 text-lg flex w-full justify-center h-[50%] items-center font-medium">
                You haven't solved any problems yet. Start solving to track your
                progress!
              </div>
            ) : (
              <div className="flex">
                <div className="mt-6 w-[70%]">
                  {/* Bar Chart for Rating Distribution */}
                  <Bar
                    data={{
                      labels: generateRatingIntervals(), // Intervals from 1100-1200 to 1900-2000
                      datasets: [
                        {
                          label: "Rating Distribution",
                          data: solvedQuestionsData.ratingDistribution,
                          backgroundColor: "rgba(75, 192, 192, 0.6)",
                          borderColor: "rgba(75, 192, 192, 1)",
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        title: {
                          display: true,
                          text: "Rating Distribution of Solved Problems",
                          color: "white",
                        },
                      },
                      scales: {
                        x: {
                          title: {
                            display: true,
                            text: "Rating Range",
                            color: "white",
                          },
                          grid: {
                            color: "rgba(255, 255, 255, 0.1)",
                          },
                          ticks: {
                            color: "white",
                          },
                        },
                        y: {
                          title: {
                            display: true,
                            text: "Count",
                            color: "white",
                          },
                          grid: {
                            color: "rgba(255, 255, 255, 0.1)",
                          },
                          ticks: {
                            color: "white",
                          },
                        },
                      },
                    }}
                  />
                </div>

                {/* Pie Chart for Tag Distribution */}
                <div className="mt-6 w-[20rem]">
                  <Pie
                    data={{
                      labels: Object.keys(solvedQuestionsData.tagsDistribution),
                      datasets: [
                        {
                          label: "Tag Distribution",
                          data: Object.values(
                            solvedQuestionsData.tagsDistribution
                          ),
                          backgroundColor: [
                            "#FF6384",
                            "#36A2EB",
                            "#FFCE56",
                            "#4BC0C0",
                            "#9966FF",
                          ],
                          borderColor: "#fff",
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        title: {
                          display: true,
                          text: "Tag Distribution of Solved Problems",
                          color: "white",
                        },
                      },
                    }}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default ProfileData;
