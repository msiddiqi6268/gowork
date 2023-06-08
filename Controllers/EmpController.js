import EmployerProfile from "../Models/EmployerProfile.js";
import Pricing from "../Models/Pricing.js";
import jwtDecode from "jwt-decode";
import User from "../Models/User.js";
import CandidatesPersonalInfo from "../Models/Candidate.js";
import CandidateEducation from "../Models/Education.js";
import CandidateAbout from "../Models/CandidateAbout.js";
import HttpErrors from "http-errors";
import CandidateExperience from "../Models/Experience.js";
import CandidateSkills from "../Models/Skills.js";
import Offers from "../Models/Offers.js";
import Conversation from "../Models/Conversation.js";
import Message from "../Models/Message.js";
import Package from "../Models/Package.js";
import { name } from "ejs";
import { send_offer_email } from "../helpers/SendEmails.js";

export const get_pricing = async (req, resp) => {
    const price = await Pricing.find({})
    return resp.status(200).json(price)
}


export const save_profile = async (req, resp, next) => {
    if (!req.headers['authorization']) return next(HttpErrors.Unauthorized())
    console.log(req.body)
    try {
        req.body.profile_data.user_id = jwtDecode(req.headers['authorization'].split(' ')[1]).aud
        const infoExists = EmployerProfile.findOne({ user_id: req.body.profile_data.user_id })
        console.log(infoExists)
        if (infoExists) {
            await EmployerProfile.findOneAndDelete({ user_id: req.body.user_id })
        }
        const info = EmployerProfile.create(req.body.profile_data, (err, doc) => {
            if (err) {
                console.log(err)
                return resp.status(400).json({ message: 'User Info not saved.' })
            }
            if (doc) {
                return resp.status(200).json(doc)
            }
        })
    }
    catch (err) {
        console.log(err)
        return resp.status(400).json({ message: 'User Info not saved.' })
    }
}


export const send_profile = async (req, resp, next) => {
    console.log(req.headers['authorization'])
    if (!req.headers['authorization']) return next(HttpErrors.Unauthorized())
    try {
        const { aud } = jwtDecode(req.headers['authorization'].split(' ')[1])
        console.log(aud)
        const user = EmployerProfile.findOne({ user_id: aud }, (err, doc) => {
            if (!doc) {
                return resp.status(400).json({ message: 'User Info not saved.' })
            }
            else {
                return resp.status(200).json(doc)
            }
        })
    }
    catch (err) {
        return resp.status(400).json({ message: 'Invalid Request.' })
    }
}



export const get_candidates = async (req, resp, next) => {
    if (!req.headers['authorization']) return next(HttpErrors.Unauthorized())
    const candidates = []
    const users = await User.find({ role: 'candidate' })

    for (let i = 0; i < users.length; i++) {
        const education = await CandidateEducation.find({ user_id: users[i]._id })
        const personal_info = await CandidatesPersonalInfo.find({ user_id: users[i]._id })
        const about = await CandidateAbout.find({ user_id: users[i]._id })
        if (personal_info.length !== 0 && about.length !== 0 && education.length !== 0) {
            console.log('len', personal_info.length, education.length, about.length)
            const info = {
                user_id: users[i]._id,
                education_title: education[0].education[education[0].education.length - 1].title,
                education_level: education[0].education[education[0].education.length - 1].level,
                title: about[0].title,
                name: personal_info[0].f_name + ' ' + personal_info[0].l_name,
                location: personal_info[0].address.city,
                gender: personal_info[0].gender
            }
            candidates.push(info)
        }
    }
    return resp.status(200).json(candidates)
}

export const get_candidate_details = async (req, resp, next) => {
    if (!req.headers['authorization']) return next(HttpErrors.Unauthorized())
    const user_id = req.body.user_id
    User.findById(user_id, async (err, doc) => {
        if (doc) {
            User.findOneAndUpdate({ _id: user_id }, { profile_views: doc.profile_views + 1 },(err,doc)=>{
                if(doc){
                    console.log('views updated')
                }
            })
        }
        else if(err){
            console.log('err',err)
        }
    })
    const education = await CandidateEducation.find({ user_id: user_id })
    const personal_info = await CandidatesPersonalInfo.find({ user_id: user_id })
    const about = await CandidateAbout.find({ user_id: user_id })
    const experience = await CandidateExperience.find({ user_id: user_id })
    const skills = await CandidateSkills.find({ user_id: user_id })
    let p_info = {
        name: personal_info[0].f_name + " " + personal_info[0].l_name,
        gender: personal_info[0].gender,
        marital_status: personal_info[0].martial_status,
        dob: personal_info[0].dob,
    }
    const info = { user_id, education: education[0], personal_info: p_info, about: about[0], experience: experience[0], skills: skills[0] }
    console.log(experience[0])
    return resp.status(200).json(info)
}


export const get_candidate_full_details = async (req, resp, next) => {
    if (!req.headers['authorization']) return next(HttpErrors.Unauthorized())
    const user_id = req.body.user_id
    const employer_id = jwtDecode(req.headers['authorization'].split(' ')[1]).aud
    const offers = await Offers.find({employer:employer_id})
    var valid = false
    if(offers){
        for(let i = 0; i<offers.length;i++){
            if(offers[i].candidates.includes(user_id)){
                valid = true
            }
        }
    }
    if(valid){
        const basic_info = await User.findById(user_id)
    const education = await CandidateEducation.find({ user_id: user_id })
    const personal_info = await CandidatesPersonalInfo.findOne({ user_id: user_id })
    const about = await CandidateAbout.find({ user_id: user_id })
    const experience = await CandidateExperience.find({ user_id: user_id })
    const skills = await CandidateSkills.find({ user_id: user_id })
    const info = { user_id, basic_info,education: education[0], personal_info: personal_info, about: about[0], experience: experience[0], skills: skills[0] }
    console.log(experience[0])
    return resp.status(200).json(info)
    }
    else{
        return next(HttpErrors.Unauthorized())
    }
}


export const send_offer = async (req, resp, next) => {
    if (!req.headers['authorization']) return next(HttpErrors.Unauthorized())
    try {
        const { aud } = jwtDecode(req.headers['authorization'])
        const body = req.body
        body.employer = aud
        console.log('body', body)
        const current_package = await Package.findOne({ user_id: aud })
        if (!(current_package.connects >= body.candidates.length)) {
            return resp.status(400).message({ 'message': "You don't have enough connects, please buy them first." })
        }
        await Offers.create(req.body, async (err, doc) => {
            if (err) {
                console.log(err)
                return resp.status(400).json({ 'message': "Offer not sent!" })
            }
            else if (doc && doc !== []) {
                console.log('doc', doc)

                for (let i = 0; i < doc.candidates.length; i++) {
                    const existing_conv = await Conversation.findOne({candidate: doc.candidates[i]})
                    if(!existing_conv){
                        Conversation.create({ candidate: doc.candidates[i], employer: aud }, async (err, doc) => {
                            if (err) {
                                await Offers.delete({ _id: doc._id })
                                console.log('err', err)
                                return resp.status(400).json({ 'message': "Offer not sent!" })
                            }
                            else if (doc) {
                                await Message.create({ conversation_id: doc._id, sender: aud, text: "Congratulations, You have been selected by us for further recruitment process. Accept the offer to continue with us." }, (err, doc) => {
                                    if (err) {
                                        console.log(err)
                                    }
                                })
                            }
                        })
                    }
                    else{
                        await Message.create({ conversation_id: existing_conv._id, sender: aud, text: "Congratulations, We have sent you another offer. Check it now!" })
                    }
                }
                for(let i = 0;i<body.candidates.length;i++){
                    const user_info = await User.findById(body.candidates[i])
                    send_offer_email(user_info)
                }
                return resp.status(200).json(doc)
            }
        })
    }
    catch (e) {
        console.log(e)
        return resp.status(500).json({ 'message': "Internal Server Error" })
    }
}

export const send_dashboard_data = async (req,resp,next)=>{
    if (!req.headers['authorization']) return next(HttpErrors.Unauthorized())
    const user_id = jwtDecode(req.headers['authorization'].split(' ')[1]).aud
    try{

        const for_connects = await Package.findOne({user_id:user_id})
        const for_offers =  await Offers.find({employer:user_id})
        let data = {remaining_connects:0,offers:0}
        if(for_connects){
            data.remaining_connects = for_connects.connects
        }
        if(for_offers){
            data.offers = for_offers.length
        }
        console.log(data)
        return resp.status(200).json(data)
    }
    catch(err){
        console.log(err)
        return resp.status(501).json({message:'Internal Server Error'})
    }
}


export const send_offers_data = async (req,resp,next)=>{
    if (!req.headers['authorization']) return next(HttpErrors.Unauthorized())
    const user_id = jwtDecode(req.headers['authorization'].split(' ')[1]).aud
    try{
        var data=  await Offers.find({employer:user_id}).lean()
        for(let i = 0; i<data.length;i++){
            var candidates = []
            for(let j = 0; j<data[i].candidates.length;j++){
            const cand_details = await CandidatesPersonalInfo.findOne({user_id:data[i].candidates[j]})
            if(cand_details){
                candidates = [...candidates,{name:cand_details.f_name + " " + cand_details.l_name,
                                                id:data[i].candidates[j]}]
            }
            }
            console.log(candidates)
            data[i]['candidates'] = candidates
        }
        return resp.status(200).json(data)
    }
    catch(err){
        console.log(err)
        return resp.status(501).json({message:'Internal Server Error'})
    }
}

// export const send_offers_details = async (req,resp,next)=>{
//     if (!req.headers['authorization']) return next(HttpErrors.Unauthorized())
//     const user_id = jwtDecode(req.headers['authorization'].split(' ')[1]).aud
//     try{
//         const {offer_id} = req.body
//         const data=  await Offers.findById(offer_id)
//         if(data){

//             return resp.status(200).json(data)
//         }
//     }
//     catch(err){
//         console.log(err)
//         return resp.status(501).json({message:'Internal Server Error'})
//     }
// }



