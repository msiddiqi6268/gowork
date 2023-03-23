import mongoose from "mongoose";


const AboutSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
    },
   title:{
    type:String,
    required:true,
   },
   about:{
    type:String,
    required:true,
   },
   reference1:{
    type:String,
    required:true,
   },
   reference2:{
    type:String,
    required:true,
   },
})

const CandidateAbout = mongoose.model('CandidateAbout', AboutSchema)
export default CandidateAbout