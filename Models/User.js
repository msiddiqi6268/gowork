import mongoose, { mongo } from "mongoose";
import bcrypt, { hash } from 'bcrypt'
const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:['candidate','employer','blogger','admin']
    },
    verified:{
        type:Boolean,
        default:false,
    },
    profile_views:{
        type:Number,
        required:false,
        default:0
    }

},
{
    timestamps:true
})

UserSchema.pre('save', async function(next){
    try{
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(this.password,salt)
        this.password = hashedPassword
        next()
    }
    catch(e){
        next(e)
    }
})

const User = mongoose.model("User", UserSchema)
export default User