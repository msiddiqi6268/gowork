import EmployerProfile from "../Models/EmployerProfile.js";
import Pricing from "../Models/Pricing.js";
import jwtDecode from "jwt-decode";


export const get_pricing = async (req,resp)=>{
    const price = await Pricing.find({})
    return resp.status(200).json(price)
}


export const save_profile = async(req,resp,next)=>{
    if (!req.headers['authorization']) return next(HttpErrors.Unauthorized())
    console.log(req.body)
    try{
        req.body.profile_data.user_id = jwtDecode(req.headers['authorization'].split(' ')[1]).aud
        const infoExists = EmployerProfile.findOne({user_id:req.body.profile_data.user_id})
        console.log(infoExists)
        if(infoExists){
            await EmployerProfile.findOneAndDelete({user_id:req.body.user_id})
        }
        const info = EmployerProfile.create(req.body.profile_data,(err,doc)=>{
            if(err){
                console.log(err)
                return resp.status(400).json({message:'User Info not saved.'})
            }
            if(doc){
                return resp.status(200).json(doc)
            }
        })
    }
    catch(err){
        console.log(err)
                return resp.status(400).json({message:'User Info not saved.'})
    }
}


export const send_profile = async(req,resp,next)=>{
    console.log(req.headers['authorization'])
    if (!req.headers['authorization']) return next(HttpErrors.Unauthorized())
    try{
        const {aud} = jwtDecode(req.headers['authorization'].split(' ')[1])
        console.log(aud)
        const user = EmployerProfile.findOne({user_id:aud},(err,doc)=>{
            if(!doc){
                return resp.status(400).json({message:'User Info not saved.'})
            }
            else{
                return resp.status(200).json(doc)
            }
        })
    }
    catch(err){
        return resp.status(400).json({message:'Invalid Request.'})
    }
}