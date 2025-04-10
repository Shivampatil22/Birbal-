import { Schema, models, model } from 'mongoose';

const ProblemSchema = new Schema({
    contestId: { type: Number, required: true },
    index: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    rating: { type: Number, required: true },
    tags: { type: [String], required: true },
    // New fields with corrected format
    time_limit: { type: String }, 
    memory_limit: { type: String }, 
    problem_description: { type: String },
    input_description: { type: String },
    output_description: { type: String },
    examples: [
        {
            input: { type: String },
            output: { type: String }
        }
    ],
    explanations: { type: [String] },
});

const Problem = models.Problem || model("Problem", ProblemSchema);
export default Problem;
