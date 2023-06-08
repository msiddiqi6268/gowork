import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema({
    candidate:{
        type: mongoose.SchemaTypes.ObjectId,
        required:true,
        ref:'user'
    },
    employer:{
        type: mongoose.SchemaTypes.ObjectId,
        required:true,
        ref:'user'
    },
})

const Conversation = mongoose.model('Conversation',ConversationSchema)
export default Conversation;