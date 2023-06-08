import mongoose from "mongoose";


const ExperienceSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
    },
    experience: [
        {
            id: { type: Number, requried: true },
            company:{
                type:String,
                required:true
            },
            jobTitle:{
                type:String,
                required:true
            },
            start_date:{
                type:Date,
                required:true
            },
            end_date:{
                type:Date ,
                required:true
            },  
            achievements:{
                type:String,
                required:true
            }
        }

    ]
})

const CandidateExperience = mongoose.model('CandidateExperience', ExperienceSchema)
export default CandidateExperience