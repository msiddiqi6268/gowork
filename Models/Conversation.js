import mongoose from "mongoose";

const ConverationSchema = new mongoose.Schema({
    members:{
        type:mongoose.SchemaTypes.ObjectId,
        required:true,
    }
})

const Conversation = mongoose.model('Conversation',ConversationSchema)
export default Conversation;