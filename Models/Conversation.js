import mongoose from "mongoose";

const ConverationSchema = new mongoose.Schema({
    members:{
        type: Array,
        required:true,
    }
})

const Conversation = mongoose.model('Conversation',ConversationSchema)
export default Conversation;