
import { getUserSubmissions } from "@/lib/codeforces";
import { connectToDB } from "@/lib/dbConnect";
import User from "@/models/user";


export async function GET(req, { params }) {
    try {
        await connectToDB();
        const { userId } = await params;
        const existingUser = await User.findOne({ userId: userId });
        
        const username=existingUser.username;
        let submission= await getUserSubmissions(username,10)
        submission = submission[0];
        
        let result={
            contestId:submission.problem.contestId,
            index: submission.problem.index,
            verdict:submission.verdict
        }
        console.log(result);
        if (existingUser) {
            return new Response(JSON.stringify(result), { status: 201 });
        }
        else {
            return new Response(JSON.stringify({ message: "new user" }), { status: 203 });
        }

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
    }
}