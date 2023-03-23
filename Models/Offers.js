import mongoose from "mongoose";

const OfferSchema = new mongoose.Schema({
    employer:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'user',
        required:true
    },
    candidate:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'user',
        required:true
    },
    job:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Job',
        required:true
    }
},
)

const Offers = mongoose.model("Offer", OfferSchema)
export default Offers