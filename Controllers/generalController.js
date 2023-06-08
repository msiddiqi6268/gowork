import Pricing from "../Models/Pricing.js";
import HttpErrors from 'http-errors';
import jwtDecode from "jwt-decode";
import User from "../Models/User.js";
import ProfilePicture from "../Models/ProfilePictures.js";
import RefreshToken from '../Models/RefreshToken.js'
import fs from 'fs'
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import Blog from "../Models/Blog.js";
const __filename = fileURLToPath(import.meta.url);
const dir = dirname(__filename);
import nodemailer from 'nodemailer'
import ejs from 'ejs'
import crypto from 'crypto'
import Validation_keys from "../Models/Vaildation_keys.js";
import bcrypt, { hash } from 'bcrypt'
export const get_pricing = async (req, resp) => {
    const price = await Pricing.find({})
    return resp.status(200).json(price)
}


export const set_pricing = async (req, resp) => {
    const { _id, title, duration, discound, connects, price } = req.body
    Pricing.findByIdAndUpdate({ _id }, { title, duration, discound, connects, price }, (err, doc) => {
        console.log(doc)
        if (doc) {
            return resp.status(200)
        }
        else {
            return resp.status(400)
        }
    })
}


export const set_profile_image = async (req, resp, next) => {
    console.log('request handler')
    if (!req.headers['authorization']) return next(HttpErrors.Unauthorized())
    console.log(typeof (req.body))
    console.log('image', req.body.image)
    const recieved_image = JSON.stringify(req.body.image)
    try {
        const token = req.headers['authorization']
        const { aud } = jwtDecode(token)
        const user = User.findById(aud, async (err, doc) => {
            if (doc) {
                await ProfilePicture.findOneAndDelete({ user_id: aud })
            }
            let base64Image = recieved_image.split(';base64,').pop();
            fs.writeFile(dir.replace('Controllers', 'public/profile_pics/') + `${aud}.png`, base64Image, 'base64', function (err) {
                console.log(err);
            });
            const saved_image_url = `http://localhost:5001/profile_pics/${aud}.png`
            const new_image = ProfilePicture.create({ user_id: aud, profile_picture: saved_image_url })
            return resp.status(200).json({ message: 'Picture Saved Successfully' })
        })

    }
    catch (e) {
        console.log(e)
        return next(HttpErrors.BadRequest())
    }
}


export const logout = async (req, resp, next) => {
    if (!req.headers['authorization']) return next(HttpErrors.BadRequest())
    const { refreshToken } = req.body.refreshToken
    RefreshToken.findOneAndDelete({ token: refreshToken }, (err, doc) => {
        if (err) {
            return next(HttpErrors.BadRequest())
        }
        else {
            return resp.status(200).json({ 'message': 'Logout Successful' })
        }
    })
}

export const getAllBlogs = async (req, resp, next) => {
    const data = await Blog.find({})
    return resp.status(200).json(data)
}

export const getBlog = async (req, resp, next) => {
    try {
        const slug = req.params['slug']
        Blog.findOne({ slug: slug }, (err, doc) => {
            if (err) {
                console.log(err)
                return next(HttpErrors.BadRequest())
            }
            else {
                return resp.status(200).json(doc)
            }
        })
    }
    catch (e) {
        console.log(e)
    }
}

export const reset_password_link = async (req, resp, next) => {
    try {
        console.log(req.body)
        const { email } = req.body
        const user = await User.findOne({ email: email })
        if (user) {
            send_rest_password_email(user)
            return resp.status(200).json({ message: "Email Exists" })
        }
        else {
            return resp.status(404).json({ message: 'Email Not Found!' })
        }
    }
    catch (e) {
        console.log(e)
        return next(HttpErrors.InternalServerError())
    }
}

const send_rest_password_email = async (user) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // use a service that allows you to send emails (e.g. Gmail, Outlook, etc.)
        auth: {
            user: process.env.SENDER_MAIL, // your email address
            pass: process.env.MAIL_PSWD // your email password
        }
    });
    const { email, username, id } = user
    var key = crypto.randomBytes(20).toString('hex');
    const link = `http://localhost:3000/reset-password/${user.id}/${key}`
    await Validation_keys.create({ email: email, key: key })
    ejs.renderFile("views/Email_Templates/ResetPassword.ejs", {
        username: username,
        link: link,
        logo: `${process.env.SERVER_URL}/emails/logo.png`
    }, function (err, data) {
        if (err) {
            console.log(err)
        } else {
            var mailOptions = {
                from: process.env.SENDER_MAIL,
                to: email,
                subject: 'GoWork: Reset Password',
                html: data
            };
            transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Message sent: ' + info.response);
                }
            });
        }
    });
}


export const reset_password = async (req, resp) => {
    const { key, password, id } = req.body
    const user = await User.findById(id)
    const val_key = await Validation_keys.findOne({ email: user.email })
    console.log('key', val_key)
    console.log('got', key)
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)
    if (val_key && key === val_key.key) {
        await User.findByIdAndUpdate(id, { password: hashedPassword })
        await Validation_keys.deleteOne({email:user.email})
        return resp.status(204).json({message:'Password Updated.'})
    }
    else{
        return resp.status(400).json({message:'Operation failed.'})
    }
}