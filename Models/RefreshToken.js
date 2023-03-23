import mongoose from "mongoose";

const Schema = mongoose.Schema;

const refreshTokenSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, required: true },
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 365*24*60*60 }, // 1 year
});

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);

export default RefreshToken;