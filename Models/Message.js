
import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    conversation_id:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Conversation',
        required:true,
    },
    sender: {
        type: String,
        required: true,
    },
    text: {
        type: String,
    }
})

const Message = mongoose.model('Message',MessageSchema)
export default Message;