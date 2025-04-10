
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

    
        return new Response(
            JSON.stringify({
                user: existingUser,

            }),
            { status: 201 }
        );
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
    }
}


