import { getUserInfo } from "@/lib/codeforces";
import { connectToDB } from "@/lib/dbConnect";
import User from "@/models/user";

export async function POST(req) {
    try {
        await connectToDB(); // Connect to MongoDB
        const { username, userId } = await req.json();
        
        // Check if user already exists
        const existingUser = await User.findOne({ userId });

        if (existingUser) {
            return new Response(JSON.stringify({ message: "User already exists" }), { status: 203});
        }
        const result = await getUserInfo(username);     
        const {titlePhoto}=result;
        console.log(titlePhoto);
        // Create a new user if not found
        const user = await User.create({ username, userId,imageUrl:titlePhoto });

        return new Response(JSON.stringify(user), { status: 201 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
    }
}


