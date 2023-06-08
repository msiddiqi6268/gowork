
import HttpErrors from 'http-errors'
import jwtDecode from 'jwt-decode'
import CandidatesPersonalInfo from '../Models/Candidate.js'
import Conversation from '../Models/Conversation.js'
import EmployerProfile from '../Models/EmployerProfile.js'
import Message from '../Models/Message.js'



// get conversation
export const getConversations = async (req,resp,next)=>{
    if (!req.headers['authorization']) return next(HttpErrors.Unauthorized())
    try{
        const {aud,role}  = jwtDecode(req.headers['authorization'].split(' ')[1])
    if(role == 'candidate'){
        Conversation.find({candidate:aud},async (err,doc)=>{
            if(doc){
                let c = []
                for(let i = 0; i< doc.length; i++){
                   const emp = await EmployerProfile.findOne({user_id:doc[i].employer}) 
                   let current_emp = {conversation_id:doc[i]._id,candidate:doc[i].candidate,employer:doc[i].employer,name:emp.company_name}        
                    c.push(current_emp)
                }
                return resp.status(200).json(c)
            }
            else if(err){
                return resp.status(400).json(err)
            }
        })
    }
    else if (role == 'employer'){
        
        Conversation.find({employer:aud},async (err,doc)=>{
            if(doc){
                let c = []
                for(let i = 0; i< doc.length; i++){
                   const cand = await CandidatesPersonalInfo.findOne({user_id:doc[i].candidate}) 
                   let current_cand = {conversation_id:doc[i]._id,candidate:doc[i].candidate,employer:doc[i].employer,name:`${cand.f_name} ${cand.l_name}`}        
                    c.push(current_cand)
                }
                return resp.status(200).json(c)
            }
            else if(err){
                return resp.status(400).json(err)
            }
        })
        
    }
    }
    catch(e){
        console.log(e)
        return resp.status(500).json({'message':"Internal Server Error"})
    }
}

const get_candidate_name = (user_id)=>{
    CandidatesPersonalInfo.findOne({user_id:user_id},(err,cand_profile)=>{
        if(cand_profile){
            return cand_profile.f_name + " " + cand_profile.l_name
        }
})
}


// create conversation

export const createConversations = (req,resp,next)=>{
    if (!req.headers['authorization']) return next(HttpErrors.Unauthorized())
    try{
        const {aud,role}  = jwtDecode(req.headers['authorization'].split(' ')[1])
        if(role !== 'employer') return next(HttpErrors.Unauthorized())
        const {candidate} = req.body
        Conversation.create({employer:aud,candidate:candidate},(err,doc)=>{
            if(err){
                console.log(err)
                return resp.status(400).json({message:'Conversation not created'})
            }
            if(doc){
                return resp.status(200).json(doc)
            }
        })
    }
    catch(e){
        console.log(e)
        return resp.status(500).json({'message':"Internal Server Error"})
    }
}




export const getMessages = (req,resp,next)=>{
    if (!req.headers['authorization']) return next(HttpErrors.Unauthorized())
    const {conversation_id} = req.body
    console.log(conversation_id)
    try{
        Message.find({conversation_id:conversation_id},(err,doc)=>{
            if(err || doc == []){
                console.log(err)
                return resp.status(400).json({message:'Messages not found'})
            }
            if(doc){
                return resp.status(200).json(doc)
            }
        })
    }
    catch(e){
        console.log(e)
        return resp.status(500).json({'message':"Internal Server Error"})
    }
}


export const sendMessages = (req,resp,next)=>{
    if (!req.headers['authorization']) return next(HttpErrors.Unauthorized())
    try{
        const {reciever_id,conversation_id,text} = req.body
        const {aud,role}= jwtDecode(req.headers['authorization'])
        Conversation.findById(conversation_id,(err,doc)=>{
            console.log('conversation:',doc)
            if(err){
                console.log(err)
                return resp.status(400).json({message:'Conversation not Found'})
            }
            else if(doc){
                Message.create({conversation_id:conversation_id,sender:aud,text:text},(err,doc)=>{
                    if(err){
                        return resp.status(400).json({message:'Failed to send message'})
                    }
                    else{
                        console.log(doc)
                        return resp.status(200).json({message:text})
                    }
                })
            }
            else{
                return resp.status(400).json({message:'Message not sent'})
            }
        })
    }
    catch(e){
        console.log(e)
        return resp.status(500).json({'message':"Internal Server Error"})
    }
}