
import { connectToDB } from "@/lib/dbConnect";
import User from "@/models/user";


export async function POST(req) {

    try {
        await connectToDB();  // Connect to MongoDB
        const { username, userId } = await req.json();

        const user = await User.create({ username, userId });

        return new Response(JSON.stringify(user));

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: 'Server error' }));
    }
}