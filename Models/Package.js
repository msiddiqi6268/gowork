import mongoose from "mongoose";

const packageSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'user',
        required:true
    },
    package_name:{
        type:'String',
        required:true
    },
    connects:{
        type:Number,
        required:true
    },
    start_date:{
        type:Date,
        default:Date.now(),
        requierd:true
    },
    end_date:{
        type:Date,
        required:true
    }
})



const Package = mongoose.model('Packages',packageSchema)
export default Package;