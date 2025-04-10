
const axios = require('axios');
const BASE_URL = "https://codeforces.com/api";

// 1. Get the list of available contests
const getAvailableContests = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/contest.list`);
        return response.data.result;
    } catch (error) {
        console.error("Error fetching contests:", error);
        return [];
    }
};

// 2. Verify if a username is valid
const isValidUser = async (handle) => {
    try {
        const response = await axios.get(`${BASE_URL}/user.info`, {
            params: { handles: handle },
        });
        return response.data.status === "OK";
    } catch (error) {
        return false;
    }
};

// // 3. Get 10 problems of a given rating and tags
// const getProblemsByRatingAndTags = async (rating, tags) => {
//     try {

//         const formattedTags = Array.isArray(tags) ? tags.join(";") : tags;
//     //    console.log(formattedTags);  
//         const response = await axios.get(`${BASE_URL}/problemset.problems`, {
//             params: { tags: formattedTags },
//         });
        

//         const result= response.data.result.problems
            
//         console.log(result);
        
//         return result;
//     } catch (error) {
//         console.error("Error fetching problems:", error);
//         return [];
//     }
// };

const getProblemsByRatingAndTags = async (rating, tags) => {
    try {
        if (!Array.isArray(tags)) {
            throw new Error("Tags must be an array.");
        }

        let problemsByTag = {};

        for (const tag of tags) {
            const response = await axios.get(`${BASE_URL}/problemset.problems`, {
                params: { tags: tag },
            });

            const problems = response.data.result.problems
                .filter(problem =>
                    problem.rating >= rating &&
                    problem.rating <= rating + 100
                )
                .slice(0, 100); // Get only 100 problems per tag

            problemsByTag[tag] = problems;
        }

        console.log(problemsByTag["greedy"].length);
        return problemsByTag;
    } catch (error) {
        console.error("Error fetching problems:", error);
        return {};
    }
};

// 4. Get the first 100 submissions of a user
const getUserSubmissions = async (handle,count) => {
    try {
        const response = await axios.get(`${BASE_URL}/user.status`, {
            params: { handle, from: 1, count: count },
        });
        return response.data.result;
    } catch (error) {
        console.error("Error fetching submissions:", error);
        return [];
    }
};

// 5. Check if a user has submitted a specific problem and got an "OK" verdict
const hasSolvedProblem = async (handle, contestId, index) => {
    try {
        const submissions = await getUserSubmissions(handle);
        return submissions.some(
            (submission) =>
                submission.problem.contestId === contestId &&
                submission.problem.index === index &&
                submission.verdict === "OK"
        );
    } catch (error) {
        console.error("Error checking problem submission:", error);
        return false;
    }
};


// 3. Get user info
const getUserInfo = async (handle) => {
    try {
        const response = await axios.get(`${BASE_URL}/user.info`, {
            params: { handles: handle },
        });
        return response.data.result[0];
    } catch (error) {
        console.error("Error fetching user info:", error);
        return null;
    }
};



// getProblemsByRatingAndTags(1200, ["greedy","brute force"]);

module.exports = {
    getAvailableContests,
    isValidUser,
    getProblemsByRatingAndTags,
    getUserSubmissions,
    hasSolvedProblem,
    getUserInfo
};