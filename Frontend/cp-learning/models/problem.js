import { Schema, models, model } from 'mongoose';

const ProblemSchema = new Schema({
    contestId: { type: Number, required: true },
    index: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    rating: { type: Number, required: true },
    tags: { type: [String], required: true },
});

 const Problem = models.Problem||model("Problem", ProblemSchema);
export default Problem;
