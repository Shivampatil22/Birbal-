import { Schema, models, model } from 'mongoose';

const BattleSchema = new Schema({
    winnerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    loserId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    problemId: {
        type: Schema.Types.ObjectId,
        ref: 'Problem',
        required: true,
    },
    verdict: {
        type: String,
        enum: ['success', 'draw'],
        required: true,
    },
}, { timestamps: true });

const Battle = models.Battle || model('Battle', BattleSchema);
export default Battle;
