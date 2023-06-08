import mongoose from "mongoose";

const OfferSchema = new mongoose.Schema({
    employer:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'user',
        required:true
    },
    candidates:[
        {
            type:mongoose.SchemaTypes.ObjectId,
            ref:'user',
            required:true
        }
    ],
    position:{
        type:String,
        required:true
    },
    job_type:{
        type:String,
        required:true
    },
    min_salary:{
        type:Number,
        requried:true
    },
    max_salary:{
        type:Number,
        requried:true
    },
    job_description:{
        type:String,
        required:true
    },
},
)

const Offers = mongoose.model("Offer", OfferSchema)
export default Offers