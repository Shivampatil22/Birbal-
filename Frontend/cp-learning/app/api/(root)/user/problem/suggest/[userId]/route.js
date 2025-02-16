import { connectToDB } from "@/lib/dbConnect";
import Problem from "@/models/problem"; // Import the Problem model FIRST
import User from "@/models/user"; // Import User AFTER Problem

export async function GET(req, { params }) {
    try {
        await connectToDB(); // Ensure database connection
        const { userId } =await  params; // No need for `await` here

        // Check if user already exists
        const existingUser = await User.findOne({ userId }).populate("suggested_problems");

        if (existingUser) {
            return new Response(JSON.stringify({ suggestedProblems: existingUser.suggested_problems, no_of_problems: existingUser.suggested_problems.length }), { status: 201 });
        } else {
            return new Response(JSON.stringify({ message: "new user" }), { status: 203 });
        }
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
    }
}
