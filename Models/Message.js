
import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    ConversationId:{
        type:string,
        required:true,
    },
    sender: {
        type: string,
        required: true,
    },
    text: {
        type: string,
    }
})

const Message = mongoose.model('Message',MessageSchema)
export default Message;