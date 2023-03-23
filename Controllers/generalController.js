import Pricing from "../Models/Pricing.js";
import HttpErrors from 'http-errors';
import jwtDecode from "jwt-decode";
import User from "../Models/User.js";
import ProfilePicture from "../Models/ProfilePictures.js";
import fs from 'fs'
import { fileURLToPath } from 'url';
import path,{ dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const dir = dirname(__filename);


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
    console.log(typeof(req.body))
    console.log('image',req.body.image)
    const recieved_image = JSON.stringify(req.body.image)
    try {
        const token = req.headers['authorization']
        const { username } = jwtDecode(token)
        const user = User.findOne({ username: username }, async(err, doc) => {
            const { _id } = doc
            await ProfilePicture.findOneAndDelete({ user_id: _id })
            let base64Image = recieved_image.split(';base64,').pop();
            console.log(base64Image)
            fs.writeFile(dir.replace('Controllers','public/profile_pics/')+`${_id}.png`, base64Image, 'base64', function(err) {
                console.log(err);
              });
            const saved_image_url = `http://localhost:5001/profile_pics/${_id}.png`
            const new_image = ProfilePicture.create({ user_id: _id, profile_picture: saved_image_url })
            return resp.status(200).json({ message: 'Picture Saved Successfully' })
        })

    }
    catch (e) {
        console.log(e)
        return next(HttpErrors.BadRequest())
    }
}