import mongoose from "mongoose";

const ChatMessageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    requestId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'requestModel',
        required: true
    },
    requestModel: {
        type: String,
        required: true,
        enum: ['RaiseRequest', 'GeneralRequest']
    },
    message: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    reactions: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        emoji: String
    }],
    isDeleted: {
        type: Boolean,
        default: false
    },
    isEdited: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export default mongoose.model("ChatMessage", ChatMessageSchema);
