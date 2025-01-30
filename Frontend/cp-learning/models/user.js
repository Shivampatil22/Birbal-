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
    }});

const User = models.User || model('User', userSchema);

export default User;
