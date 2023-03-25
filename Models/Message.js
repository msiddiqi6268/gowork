import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    ConversationId:{
        type:mongoose.SchemaTypes.ObjectId,
        required:true,
    },
    sender: {
        type: mongoose.SchemaType.ObjectId,
        required: true,
    },
    text: {
        type: mongoose.SchemaType.ObjectId,
    }
})

const Message = mongoose.model('Message',MessageSchema)
export default Message   ;