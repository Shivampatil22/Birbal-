import { Schema, models, model } from 'mongoose';

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    userId: {
        type: String,
        required: true,
        trim: true,
    },
    summary: {
        type: String,
        default: "No summary",
    },
    tags: {
        type: [String],
        default: [],
    },
    current_rating: {
        type: Number,
        default: 0,
    },
    last_contest:{
        type: String,
        default: "Not Participated",
    },
    imageUrl: {
        type: String,
        trim: true,
    },
    solvedProblems: [{
        type: Schema.Types.ObjectId,
        ref: 'Problem',
    }],
    favourite_problems: [{
        type: Schema.Types.ObjectId,
        ref: 'Problem',
    }],
    suggested_problems: [{
        type: Schema.Types.ObjectId,
        ref: 'Problem',
    }],
});

const User = models.User || model('User', userSchema);

export default User;
