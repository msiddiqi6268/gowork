import User from "../Models/User.js";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import SgMail from '@sendgrid/mail'
import Validation_keys from "../Models/Vaildation_keys.js";
import jwtDecode from "jwt-decode";
import * as schedule from 'node-schedule'
import HttpErrors from 'http-errors';
import { loginSchema, registerSchema } from "../helpers/ValidationSchema.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../helpers/JwtHelper.js";
import ejs from 'ejs'
import fs from 'fs'
import crypto from 'crypto'

dotenv.config()

import nodeMailgun from 'nodemailer-mailgun-transport'
import FreeTrial from "../Models/FreeTrial.js";
import Pricing from "../Models/Pricing.js";


export const login = async (req, resp, next) => {
    try {
        const result = await loginSchema.validateAsync(req.body)
        const { email, password } = result;
        const user = await User.findOne({ email: email })
        if (!user || user.role == 'admin' || user.role == 'blogger') {
            // return resp.status(404).json({"message":'User not Found'})
            throw HttpErrors.NotFound('User not Found!')
        }
        const checkPassword = await bcrypt.compare(password, user.password);
        if (checkPassword) {
            console.log(user)
            const accessToken = await signAccessToken({
                user_id: user.id,
                role: user.role,
                username: user.username,
                email:user.email
            })
            const refreshToken = await signRefreshToken({
                user_id: user.id,
                role: user.role,
                username: user.username,
                email:user.email
            })
            return resp.status(201).json({
                user: {
                    user_id: user._id,
                    email: user.email,
                    username: user.username,
                    verified: user.verified,
                    role: user.role,
                },
                accessToken, refreshToken
            })
        }
        else {
            return resp.status(400).json({ message: 'Email or Password is wrong!' })
        }
    }
    catch (e) {
        console.log(e)
        if (e.isJoi == true) return next(HttpErrors.BadRequest("Invalid Attempt!"))
        next(e)
    }
}



export const register = async (req, res, next) => {
    try {
        const register = await registerSchema.validateAsync(req.body)
        const { email, username, password, role } = register;
        const email_exists = await User.findOne({ email: email });
        const username_exists = await User.findOne({ username: username })
        if (email_exists) {
            return res.status(409).json({ 'message': "Email Already Exists" })
        }
        if (username_exists) {
            return res.status(409).json({ 'message': "Usernames Already Exists" })
        }
        const user = await User.create({ email, username, password, role })
        console.log(user)
        send_verification_email(user)
        var time = new Date()
        const price = await Pricing.find({ title: "Free Trial" })
        time.setDate(time.getDate() + price.duration);
        if (user.role == 'employer') {
            const freetrial = await FreeTrial.create({user_id:user._id})
            schedule.scheduleJob(time, async ()=>{
                await FreeTrial.findOneAndUpdate({user_id:user.id},{expired:true})
              });
        }
       
        const accessToken = await signAccessToken({
            user_id: user.id,
            role: user.role,
            username: user.username,
            email:user.email
        })
        const refreshToken = await signRefreshToken({
            user_id: user.id,
            role: user.role,
            username: user.username,
            email:user.email
        })
        return res.status(201).json({
            user: {
                user_id: user._id,
                email: email,
                username: username,
                role: role,
            },
            accessToken, refreshToken
        })
    }
    catch (e) {
        console.log(e)
        return next(HttpErrors.BadRequest("Invalid Attempt!"))
        next(e)
    }
}


// -----------------MAIL TRANSPORTER-------------



const send_verification_email = async (user) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // use a service that allows you to send emails (e.g. Gmail, Outlook, etc.)
        auth: {
            user: process.env.SENDER_MAIL, // your email address
            pass: process.env.MAIL_PSWD // your email password
        }
    });
    const {email,username,id}= user
    var key = crypto.randomBytes(20).toString('hex');
    const link = `http://localhost:3000/verification/${user.id}/${key}`
    await Validation_keys.create({ email: email, key: key })
    ejs.renderFile("views/Email_Templates/FirstEmail.ejs", { username: username,
    link:link,
    logo:`${process.env.SERVER_URL}/emails/logo.png`
    }, function (err, data) {
        if (err) {
            delete_user(user.id)
        } else {
            var mainOptions = {
                from: process.env.SENDER_MAIL,
                to: email,
                subject: 'GoWork: Email Verification',
                html: data
            };
            transporter.sendMail(mainOptions, function (err, info) {
                if (err) {
                    delete_user(user.id)
                    console.log(err);
                } else {
                    console.log('Message sent: ' + info.response);
                }
            });
        }});
}

// DELETE USER

const delete_user =  (user_id)=>{
    User.findOneAndDelete({id:user_id},(err,doc)=>{
        if(err){
            console.log(err)
        }
    })
}


export const verify = async (req, resp) => {
    try{
        const { id,key } = req.body
    if(!id || !key){
        return resp.status(400).json({ 'message': 'Either Link is expired or not correct!' })
    }
    const {email} = await User.findById(id)
    const verification_match = await Validation_keys.find({ email: email,key:key })
    if (verification_match[0]) {
        console.log('exists')
        if (verification_match[0].key === key) {
            console.log('matched')
            await User.findOneAndUpdate({ id: id }, { verified: true })
            console.log('updated')
            return resp.status(200).json({ 'message': 'Verification Successfull!' })
        }
        else
            return resp.status(400).json({ 'message': 'Either Link is expired or not correct!' })
    }
    else
        return resp.status(400).json({ 'message': 'Either Link is expired or not correct!' })
    }
    catch(e){
        return HttpErrors.InternalServerError()
    }
}


export const getOtp = async (req, resp) => {
    return sendOtp(req, resp)
}

export const resend_verification_email = async (req, resp) => {
    const token = req.headers['authorization']
    const bearerToken = token.split(' ')[1]
    const { email } = jwtDecode(bearerToken)
    const user = await User.findOne({ email: email })
    console.log(userExists)
    if (userExists) {
        await Otp.deleteMany({ userEmail })
    }

    try {
        send_verification_email(user)
        return resp.status(200).json({ message: "Verification Email sent Successfully!" })
    }
    catch (err) {
        console.log(err)
        return resp.status(400).json({ message: "Failed to send verification email!" })
    }
}


export const getUser = async (req, resp) => {
    const { id } = req.params
    const user = await User.find({ user_id: id })
    if (user) {
        return resp.status(200).json(user)
    }
    else return resp.status(404).json({ message: 'User not Found' })
}


export const access_token = async (req, resp, next) => {
    const { refreshToken } = req.body;
    verifyRefreshToken(refreshToken).then(async ({ tokenDetails }) => {
        console.log('tokendetails line 245',tokenDetails)
        const accessToken = await signAccessToken(tokenDetails)
        console.log('accessToken generated',accessToken)
        const refreshToken = await signRefreshToken(tokenDetails)
        console.log('refreshToken generated',refreshToken)
        return resp.status(200).json({accessToken,refreshToken})
    }).catch((e) => {
        return HttpErrors.BadRequest()
    })
}



// --------------------------ADMIN---------------------------------

export const adminLogin = async (req, resp) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email })
    console.log(user)
    if (user.role == 'admin') {
        console.log('heel')
    }
    else {
        console.log('ppppp')
    }
    if (!user || user.role == 'candidate' || user.role == 'employer') {
        return resp.status(404).json({ message: 'User not Found' })
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    if (checkPassword) {
        const token = jwt.sign(
            {
                user_id: user._id,
                username: user.username,
                userEmail: user.email,
                userRole: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_LIFETIME,
            }
        );

        return resp.status(201).json({
            user: {
                user_id: user._id,
                email: user.email,
                username: user.username,
                verified: user.verified,
                role: user.role,
            },
            token
        })
    }
    else {
        return resp.status(400).json({ message: 'Email or Password is wrong!' })
    }
}


export const refreshToken = async (req, resp) => {
    try {
        const { refreshToken } = req.body
        console.log({ refreshToken })
        if (!refreshToken) throw HttpErrors.BadRequest()
        const user_id = await verifyRefreshToken(refreshToken)
        console.log({ user_id })
        const accessToken = await signAccessToken(user_id)
        const refToken = await signRefreshToken(user_id)
        return resp.send({ accessToken: accessToken, refreshToken: refToken })
    } catch (error) {
        next(error)
    }
}

export const logout = async (req, resp) => {
    // try {
    //     const { refreshToken } = req.body
    //     if (!refreshToken) throw HttpErrors.BadRequest()
    //     const user_id = await verifyRefreshToken(refreshToken)
    //     client.DEL(user_id, (err, val) => {
    //         if (err) {
    //             console.log(err.message)
    //             throw HttpErrors.InternalServerError()
    //         }
    //         console.log(val)
    //         return resp.sendStatus(204)
    //     })
    // } catch (error) {
    //     next(error)
    // }
}