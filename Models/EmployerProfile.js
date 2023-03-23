import mongoose from "mongoose";

const EmployerProfileSchema = new mongoose.Schema({
    company_name:{
        type:String,
        required:true,
    },
    website:{
        type:String,
        required:true,
    },
    about:{
        type:String,
        required:true,
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


const EmployerProfile = mongoose.model('EmployerProfile',EmployerProfileSchema)
export default EmployerProfile