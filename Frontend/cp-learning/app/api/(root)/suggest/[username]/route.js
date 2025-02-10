import { getProblemsByRatingAndTags } from "@/lib/codeforces";
import { connectToDB } from "@/lib/dbConnect";
import User from "@/models/user";
import Problem from "@/models/problem";

export async function POST(req, { params }) {
    try {
        await connectToDB(); // Connect to MongoDB

        const { username } = await params;
   

        // Step 1: Fetch user data
        const user = await User.findOne({ username }).populate("solvedProblems").populate("suggested_problems");
        if (!user) {
            return new Response(JSON.stringify({ message: "User not found." }), { status: 404 });
        }
       
        const {current_rating} = user;

        let rating =current_rating;
       
        // Step 2: Fetch 10 problems of given rating and tags
        const allProblems = await getProblemsByRatingAndTags(rating, user.tags);
        // console.log(allProblems);   
        if (!allProblems.length) {
            return new Response(JSON.stringify({ message: "No problems found." }), { status: 404 });
        }

        // Step 3: Handle case where solvedProblems & suggestedProblems might be empty
        const solvedProblemIds = new Set(
            user.solvedProblems?.map(p => `${p.contestId}-${p.index}`) || []
        );
        const suggestedProblemIds = new Set(
            user.suggested_problems?.map(p => `${p.contestId}-${p.index}`) || []
        );

        // Step 4: Filter out problems already solved or previously suggested
        const unsolvedProblems = allProblems.filter(
            (problem) => 
                !solvedProblemIds.has(`${problem.contestId}-${problem.index}`) &&
                !suggestedProblemIds.has(`${problem.contestId}-${problem.index}`)
        ).slice(0, 10); // Pick first 10 unique problems

        // Step 5: Get existing problems from DB in one query
        const existingProblems = await Problem.find({
            $or: unsolvedProblems.map((p) => ({ contestId: p.contestId, index: p.index }))
        });

        // Step 6: Determine which problems are new and need to be inserted
        const existingProblemIds = new Set(existingProblems.map(p => `${p.contestId}-${p.index}`));
        const newProblems = unsolvedProblems.filter(
            (problem) => !existingProblemIds.has(`${problem.contestId}-${problem.index}`)
        ).map((problem) => ({
            contestId: problem.contestId,
            index: problem.index,
            name: problem.name,
            type: problem.type,
            rating: problem.rating,
            tags: problem.tags,
        }));

        // Step 7: Insert new problems in one go
        if (newProblems.length > 0) {
            await Problem.insertMany(newProblems);
        }

        // Step 8: Get final list of problem IDs
        const finalProblems = await Problem.find({
            $or: unsolvedProblems.map((p) => ({ contestId: p.contestId, index: p.index }))
        });

        // Step 9: Update user's suggested problems
        user.suggested_problems = finalProblems.map(p => p._id);
        await user.save();

        return new Response(JSON.stringify({ message: "Suggested problems updated.", suggestedProblems: finalProblems }), { status: 200 });

    } catch (error) {
        console.error("Error in suggestion route:", error);
        return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
    }
}
