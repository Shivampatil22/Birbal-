import { Schema, models, model } from 'mongoose';


const SolvedProblemSchema = new Schema({
    contestId: { type: Number, required: true },
    index: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    rating: { type: Number, required: true },
    tags: { type: [String], required: true },
    participantType: { type: String, required: true },
    verdict: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

export const SolvedProblem = models.SolvedProblem || model("SolvedProblem", SolvedProblemSchema);