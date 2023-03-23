import mongoose from "mongoose";


const SkillsSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
    },
    skills: [
        {
            id: { type: Number, requried: true },
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
        }

    ]
})

const CandidateSkills = mongoose.model('CandidateSkills', SkillsSchema)
export default CandidateSkills