import { getProblemsByRatingAndTags } from "@/lib/codeforces";
import { connectToDB } from "@/lib/dbConnect";
import User from "@/models/user";
import Problem from "@/models/problem";

export async function POST(req, { params }) {
    try {
        await connectToDB(); // Connect to MongoDB

        const { userId } = await params;

        // Step 1: Fetch user data
        const user = await User.findOne({ userId }).populate("solvedProblems").populate("suggested_problems");
        if (!user) {
            return new Response(JSON.stringify({ message: "User not found." }), { status: 404 });
        }
        const { current_rating, tags, solvedProblems = [], suggested_problems = [] } = user;
        const rating = current_rating;

        console.log("Fetching problems for tags:", tags);

        // Step 2: Fetch problems per tag
        const allProblemsByTag = await getProblemsByRatingAndTags(rating, tags);

        // Convert solved & suggested problems into Sets for O(1) lookups
        const solvedProblemIds = new Set(solvedProblems.map(p => `${p.contestId}-${p.index}`));
        const suggestedProblemIds = new Set(suggested_problems.map(p => `${p.contestId}-${p.index}`));

        // Step 3: Filter and collect exactly 4 unique problems per tag
        let allProblems = [];
        for (const tag of tags) {
            if (allProblemsByTag[tag]) {
                const filteredProblems = allProblemsByTag[tag].filter(
                    problem =>
                        !solvedProblemIds.has(`${problem.contestId}-${problem.index}`) &&
                        !suggestedProblemIds.has(`${problem.contestId}-${problem.index}`)
                );
                allProblems.push(...filteredProblems.slice(0, 4));
            }
        }

        // // Ensure `finalProblems.length = tags.length * 4`
        // if (allProblems.length < tags.length * 4) {
        //     return new Response(JSON.stringify({ message: "Not enough unique unsolved problems found." }), { status: 404 });
        // }

        // Step 4: Query DB for existing problems in one go
        const problemKeys = allProblems.map(p => ({ contestId: p.contestId, index: p.index }));
        const existingProblems = await Problem.find({ $or: problemKeys }).lean();

        const existingProblemIds = new Set(existingProblems.map(p => `${p.contestId}-${p.index}`));

        // Step 5: Bulk insert new problems (only if they don't exist)
        const newProblems = allProblems
            .filter(problem => !existingProblemIds.has(`${problem.contestId}-${problem.index}`))
            .map(problem => ({
                contestId: problem.contestId,
                index: problem.index,
                name: problem.name,
                type: problem.type,
                rating: problem.rating,
                tags: problem.tags,
            }));

        if (newProblems.length > 0) {
            await Problem.insertMany(newProblems);
        }

        // Step 6: Fetch final problems from DB in one optimized query
        const finalProblems = await Problem.find({ $or: problemKeys }).limit(tags.length * 4).lean();

        // Step 7: Update user's suggested problems **efficiently**
        await User.updateOne({ userId }, { $set: { suggested_problems: finalProblems.map(p => p._id) } });

        return new Response(JSON.stringify({ message: "Suggested problems updated.", suggestedProblems: finalProblems }), { status: 200 });

    } catch (error) {
        console.error("Error in suggestion route:", error);
        return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
    }
}
