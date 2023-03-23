import mongoose, { mongo } from "mongoose";

const JobSchema = new mongoose.Schema({
    job_title:{
        type:Number,
        required:true
    },
    salary_range:{
        type:String,
        required:true,
    },
    timmings:{
        type:String,
        required:true
    },
    job_address:{
        type:String,
        required:true
    },
    job_type:{
        type:String,
        enum:['Full Time','Part Time','Internship']
    },
    job_description:{
        type:String,
        required:true
    },
})

const Jobs = mongoose.model('Job',JobSchema)
export default Jobs