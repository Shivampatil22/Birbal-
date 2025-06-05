import { connectToDB } from "@/lib/dbConnect";
import User from "@/models/user";
import Problem from "@/models/problem";

export async function GET(req, { params }) {
  try {
    await connectToDB();

    const { userId } =await params;

    const user = await User.findOne({ userId }).populate("favourite_problems");

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(user.favourite_problems), { status: 200 });
  } catch (err) {
    console.error("Error fetching favourite problems:", err);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}
