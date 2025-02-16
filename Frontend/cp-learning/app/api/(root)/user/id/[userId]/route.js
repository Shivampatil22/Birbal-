
import { connectToDB } from "@/lib/dbConnect";
import User from "@/models/user";


export async function GET(req, { params }) {
    try {
        await connectToDB(); // Connect to MongoDB
        const { userId } = await params;

        // Check if user already exists
        const existingUser = await User.findOne({ userId: userId });
        if (existingUser) {
            return new Response(JSON.stringify(existingUser), { status: 201 });
        }
        else {
            return new Response(JSON.stringify({ message: "new user" }), { status: 203 });
        }

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
    }
}