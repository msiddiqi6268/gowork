import mongoose from "mongoose";


const ProfilePictureSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'User',
        required:true
    },
    profile_picture:{
        type:String,
        required:true
    }
})


const ProfilePicture = mongoose.model('Profile Picture',ProfilePictureSchema)
export default ProfilePicture