import mongoose from "mongoose";

const candid_schema = new mongoose.Schema({
    f_name:{
        type:String,
        required:true
    },
    l_name:{
        type:String,
        required:true
    },
    mobile_number:{
        type:String,
        required:true
    },
    dob:{
        type:Date,
        required:true
    },
    gender:{
        type:String,
        required:true,
        enum:['male','female','other']
    },
    martial_status:{
        type:String,
        required:true,
        enum:['married','single','divorced']
    },
    cnic:{
        type:String,
        required:true
    },
    address:{
        address_line1:{
            type:String,
            required:true
        },
        address_line2:{
            type:String,
            required:false
        },
        city:{
            type:String,
            required:true
        },
        zip_code:{
            type:String,
            required:true
        },
        state:{
            type:String,
            required:true
        },
        country:{
            type:String,
            required:true
        },

    },
    user_id:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'User'
    }
})


const CandidatesPersonalInfo = mongoose.model('Candidates_Personal_Info',candid_schema)
export default CandidatesPersonalInfo