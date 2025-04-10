import { connectToDB } from "@/lib/dbConnect";
import User from "@/models/user";
import Problem from "@/models/problem";

export async function PATCH(req, { params }) {
    try {
        await connectToDB();

        const { userId, problemId } = await params;

        const user = await User.findOne({ userId });

        if (!user) {
            return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
        }

        const problem = await Problem.findById(problemId);
        if (!problem) {
            return new Response(JSON.stringify({ message: "Problem not found" }), { status: 404 });
        }

        const isAlreadySaved = user.favourite_problems.includes(problem._id);

        if (isAlreadySaved) {
            // Unsave the problem
            user.favourite_problems = user.favourite_problems.filter(
                (id) => id.toString() !== problem._id.toString()
            );
            await user.save();
            return new Response(JSON.stringify({ message: "Problem removed from favourites", status: "unsaved" }), { status: 200 });
        } else {
            // Save the problem
            user.favourite_problems.push(problem._id);
            await user.save();
            return new Response(JSON.stringify({ message: "Problem added to favourites", status: "saved" }), { status: 200 });
        }
    } catch (error) {
        console.error("Error toggling favourite problem:", error);
        return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
    }
}
