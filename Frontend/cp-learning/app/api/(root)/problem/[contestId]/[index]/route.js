import { connectToDB } from "@/lib/dbConnect";
import Problem from "@/models/problem";
import axios from "axios";

export async function POST(req, { params }) {
    try {
        await connectToDB();

        const { contestId, index } = await params;

        // Try to find existing problem
        let problem = await Problem.findOne({ contestId: contestId, index });

        // If not found, create using injected problem data from request body
        if (!problem) {
            const { problem: problemData } = await req.json();
            console.log(problemData);
            if (!problemData || !problemData.name || !problemData.tags) {
                return new Response(JSON.stringify({ message: "Problem not found and no problem data provided." }), {
                    status: 404,
                });
            }

            // Create new instance
            problem = new Problem({
                contestId,
                index,
                name: problemData.name,
                tags: problemData.tags||[],
                rating: problemData.rating || null,
                type:"programming",
            });
        }

        // If description already exists, return it
        if (problem.problem_description) {
            return new Response(JSON.stringify(problem), { status: 200 });
        }

        // Scrape additional problem data
        const res = await axios.get(
            `https://birbal.onrender.com/api/problem/${contestId}/${index}`
        );
        const data = res.data;

        // Update problem with fetched data
        problem.problem_description = data.problem_description || "Unable to fetch this field";
        problem.input_description = data.input_description || "Unable to fetch this field";
        problem.output_description = data.output_description || "Unable to fetch this field";
        problem.examples = data.examples || [];
        problem.explanations = data.explanations || [];
        problem.time_limit = data.time_limit || "N/A";
        problem.memory_limit = data.memory_limit || "N/A";

        // Save or update the problem
        await problem.save();

        return new Response(JSON.stringify(problem), { status: 200 });
    } catch (error) {
        console.error("Error fetching problem:", error);
        return new Response(JSON.stringify({ message: "Server error" }), {
            status: 500,
        });
    }
}
