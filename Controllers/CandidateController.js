import jwtDecode from "jwt-decode"
import CandidatesPersonalInfo from "../Models/Candidate.js"
import  HttpErrors from "http-errors"
import CandidateEducation from "../Models/Education.js"
import CandidateExperience from "../Models/Experience.js"
import CandidateSkills from "../Models/Skills.js"
import CandidateAbout from "../Models/CandidateAbout.js"
import User from "../Models/User.js"
import Certifications from "../Models/Certifications.js"
import Offers from "../Models/Offers.js"

export const send_personal_info = async(req,resp,next)=>{
    if (!req.headers['authorization']) return next(HttpErrors.Unauthorized())
    console.log(req.body)
    try{
        req.body.user_id = jwtDecode(req.headers['authorization'].split(' ')[1]).aud
        const infoExists = CandidatesPersonalInfo.findOne({user_id:req.body.user_id})
        console.log(infoExists)
        if(infoExists){
            await CandidatesPersonalInfo.findOneAndDelete({user_id:req.body.user_id})
        }
        const info = CandidatesPersonalInfo.create(req.body,(err,doc)=>{
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

export const get_personal_info = async(req,resp,next)=>{
    if (!req.headers['authorization']) return next(HttpErrors.Unauthorized())
    try{
        const {aud} = jwtDecode(req.headers['authorization'].split(' ')[1])
        const user = CandidatesPersonalInfo.findOne({user_id:aud},(err,doc)=>{
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


export const get_education_info = (req,resp,next)=>{
    if (!req.headers['authorization']) return next(HttpErrors.Unauthorized())
    try{
        const {aud} = jwtDecode(req.headers['authorization'].split(' ')[1])
        const info = CandidateEducation.findOne({user_id:aud},(err,doc)=>{
            if(!doc){
                return resp.status(400).json({message:'User Info not found.'})
            }
            else{
                
                return resp.status(200).json(doc.toJSON().education)
            }
        })
    }
    catch(err){
        return resp.status(400).json({message:'Invalid Request.'})
    }
}



export const send_education_info = async (req,resp,next)=>{
    if (!req.headers['authorization']) return next(HttpErrors.Unauthorized())
    console.log(req.body)
    try{
        req.body.user_id = jwtDecode(req.headers['authorization'].split(' ')[1]).aud
        const infoExists = CandidateEducation.findOne({user_id:req.body.user_id})
        if(infoExists){
            await CandidateEducation.findOneAndDelete({user_id:req.body.user_id})
        }
        const info = CandidateEducation.create(req.body,(err,doc)=>{
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
export const get_experience_info = (req,resp,next)=>{
    if (!req.headers['authorization']) return next(HttpErrors.Unauthorized())
    try{
        const {aud} = jwtDecode(req.headers['authorization'].split(' ')[1])
        const info = CandidateExperience.findOne({user_id:aud},(err,doc)=>{
            if(!doc){
                return resp.status(400).json({message:'User Info not found.'})
            }
            else{
                return resp.status(200).json(doc.experience)
            }
        })
    }
    catch(err){
        return resp.status(400).json({message:'Invalid Request.'})
    }
}



export const send_experience_info = async (req,resp,next)=>{
    if (!req.headers['authorization']) return next(HttpErrors.Unauthorized())
    console.log(req.body)
    try{
        req.body.user_id = jwtDecode(req.headers['authorization'].split(' ')[1]).aud
        const infoExists = CandidateExperience.findOne({user_id:req.body.user_id})
        if(infoExists){
            await CandidateExperience.findOneAndDelete({user_id:req.body.user_id})
        }
        const info = CandidateExperience.create(req.body,(err,doc)=>{
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



export const get_skills_info = (req,resp,next)=>{
    if (!req.headers['authorization']) return next(HttpErrors.Unauthorized())
    try{
        const {aud} = jwtDecode(req.headers['authorization'].split(' ')[1])
        const info = CandidateSkills.findOne({user_id:aud},(err,doc)=>{
            if(!doc){
                return resp.status(400).json({message:'User Info not found.'})
            }
            else{
                return resp.status(200).json(doc.skills)
            }
        })
    }
    catch(err){
        return resp.status(400).json({message:'Invalid Request.'})
    }
}



export const send_skills_info = async (req,resp,next)=>{
    if (!req.headers['authorization']) return next(HttpErrors.Unauthorized())
    console.log(req.body)
    try{
        req.body.user_id = jwtDecode(req.headers['authorization'].split(' ')[1]).aud
        const infoExists = CandidateSkills.findOne({user_id:req.body.user_id})
        if(infoExists){
            await CandidateSkills.findOneAndDelete({user_id:req.body.user_id})
        }
        const info = CandidateSkills.create(req.body,(err,doc)=>{
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



export const get_about_info = (req,resp,next)=>{
    if (!req.headers['authorization']) return next(HttpErrors.Unauthorized())
    try{
        const {aud} = jwtDecode(req.headers['authorization'].split(' ')[1])
        const info = CandidateAbout.findOne({user_id:aud},(err,doc)=>{
            if(!doc){
                return resp.status(400).json({message:'User Info not found.'})
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



export const send_about_info = async (req,resp,next)=>{
    if (!req.headers['authorization']) return next(HttpErrors.Unauthorized())
    try{
        req.body.user_id = jwtDecode(req.headers['authorization'].split(' ')[1]).aud
        const infoExists = CandidateAbout.findOne({user_id:req.body.user_id})
        if(infoExists){
            await CandidateAbout.findOneAndDelete({user_id:req.body.user_id})
        }
        const info = CandidateAbout.create(req.body,(err,doc)=>{
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


export const send_dashboard_data = (req,resp,next)=>{
    if (!req.headers['authorization']) return next(HttpErrors.Unauthorized())
    const user_id = jwtDecode(req.headers['authorization'].split(' ')[1]).aud
    let data = {
        profile_views:0,
        certifications:0,
        offers:0
    }
    try{
        User.findOne({user_id:user_id},(err,doc)=>{
            if(doc) data = {...data,profile_views:doc.profile_views}
        })
        Certifications.findOne({user_id:user_id},(err,doc)=>{
            if(doc) data = {...data,certifications:doc.length()}
        })
        Offers.findOne({user_id:user_id},(err,doc)=>{
            if(doc) data = {...data,offers:doc.length()}
        })
        return resp.status(200).json(data)
    }
    catch(err){
        console.log(err)
        return resp.status(501).json({message:'Internal Server Error'})
    }
}