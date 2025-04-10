import { getUserSubmissions } from "@/lib/codeforces";
import { connectToDB } from "@/lib/dbConnect";
import User from "@/models/user";


export async function GET(req, { params }) {
    try {
        await connectToDB();
        const { userId } = await params;

        const existingUser = await User.findOne({ userId });

        if (!existingUser) {
            return new Response(JSON.stringify({ message: "new user" }), { status: 203 });
        }

        const submissions = await getUserSubmissions(existingUser.username, 200);
        const analysis = analyzeSubmissions(submissions);
       
        return new Response(
            JSON.stringify({
                user: existingUser,
                solved_problem_analysis: analysis,
            }),
            { status: 201 }
        );
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
    }
}

// async function getUserSubmissions(handle, count) {
//     try {
//         const response = await axios.get(`${BASE_URL}/user.status`, {
//             params: { handle, from: 1, count },
//         });
//         return response.data.result;
//     } catch (error) {
//         console.error("Error fetching submissions:", error);
//         return [];
//     }
// }

function analyzeSubmissions(submissions) {
    const solvedSet = new Set();
    const tagsDistribution = {};
    const ratingBuckets = new Array(20).fill(0); // e.g., 800-900 to 2700-2800

    submissions.forEach((submission) => {
        if (submission.verdict === "OK") {
            const { contestId, index, rating, tags } = submission.problem;
            const uniqueKey = `${contestId}${index}`;
            if (solvedSet.has(uniqueKey)) return;
            solvedSet.add(uniqueKey);

            // Count tags
            if (tags && tags.length > 0) {
                tags.forEach((tag) => {
                    if (!tagsDistribution[tag]) tagsDistribution[tag] = 0;
                    tagsDistribution[tag]++;
                });
            }

            // Count rating distribution
            if (rating) {
                const bucket = Math.floor((rating - 800) / 100);
                if (bucket >= 0 && bucket < ratingBuckets.length) {
                    ratingBuckets[bucket]++;
                }
            }
        }
    });

    return {
        solvedCount: solvedSet.size,
        ratingDistribution: ratingBuckets,
        tagsDistribution,
    };
}
