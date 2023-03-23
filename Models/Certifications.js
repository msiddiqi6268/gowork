import mongoose from "mongoose";

const CertificationSchema = new mongoose.Schema({
    certitification:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'CertificationDetail',
        required:true,
    },
    candidate:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'User',
        required:true,
    },
    watched_videos:{
        type:Number,
        required:true,
    }
})

const Certifications = mongoose.model('Certification',CertificationSchema)
export default Certifications