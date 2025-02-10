import { Jarvis } from "@/lib/AiBot";
import { getUserInfo, getUserSubmissions } from "@/lib/codeforces";
import { connectToDB } from "@/lib/dbConnect";
import User from "@/models/user";

export async function POST(req, { params }) {
    try {
        await connectToDB(); // Connect to MongoDB
        const { username } =await params;

        // Step 1: Get user info
        let userInfo = await getUserInfo(username);
        if (!userInfo) {
            return new Response(JSON.stringify({ message: "User not found." }), { status: 400 });
        }
        console.log("Got userInfo");

        // Step 2: Get user submissions
        const userSubmissions = await getUserSubmissions(username);
        console.log("Got user submissions");

        // Step 3: Create a prompt for AI analysis
        const prompt = `
            Analyze the following Codeforces user data and provide a summary. Keep it short and to the point.
            Suggest a rating level for problems they should solve to improve their rating by 100.
            Also, suggest only 3 major problem tags they should focus on.
            
            User Data:
            Handle: ${userInfo.handle}
            Current Rating: ${userInfo.rating || "Unrated"}
            Max Rating: ${userInfo.maxRating || "Unknown"}
            Rank: ${userInfo.rank || "Unranked"}
            Recent Submissions: ${JSON.stringify(userSubmissions)}
            
            Provide the output strictly in JSON format:
            {
               "summary": "text",
               "rating": <ai analyzed rating>,
               "rating_to_solve": <suggested_rating>,
               "tags": [<list of tags>]
            }
        `;

        // Step 4: Get AI response
        const analysis = await Jarvis(prompt);

        // Remove unwanted Markdown formatting (` ```json ` and ` ``` `)
        const cleanedResponse = analysis.replace(/```json|```/g, "").trim();
        const parsedAnalysis = JSON.parse(cleanedResponse);
        console.log("Got AI response");
        // Step 5: Save summary and tags to the user in MongoDB
        const updatedUser = await User.findOneAndUpdate(
            { username },
            { summary: parsedAnalysis.summary, tags: parsedAnalysis.tags,current_rating:parsedAnalysis.rating_to_solve-100 },
            { new: true, upsert: true }
        );

        return new Response(JSON.stringify(updatedUser), { status: 201 });
    } catch (error) {
        console.error("Error:", error);
        return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
    }
}
