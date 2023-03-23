import mongoose from "mongoose";

const Validation_keys_schema = new mongoose.Schema({
    email:{
        type:String,
        requried:true,
    },
    key:{
        type:String,
        required:true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60*60
      },
})


const Validation_keys = mongoose.model('ValidationKeys', Validation_keys_schema)
export default Validation_keys;