import Blog from "../Models/Blog.js";
import EmployerProfile from "../Models/EmployerProfile.js";
import Pricing from "../Models/Pricing.js";
import User from '../Models/User.js'
import jwtDecode from "jwt-decode";
import HttpErrors from 'http-errors';
import fs from 'fs'
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const dir = dirname(__filename);
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

export const admin_dashboard = async (req, resp, next) => {
    if (!req.headers['authorization']) return next(HttpErrors.Unauthorized())
    const candidates = await User.find({ role: 'candidate' })
    const employers = await User.find({ role: 'employer' })
    resp.status(200).json({ candidates: candidates.length, employers: employers.length })
}

export const getEmployerList = async (req, resp, next) => {
    if (!req.headers['authorization']) return next(HttpErrors.Unauthorized())
    const employers = await User.find({ role: 'employer' })
    let data = []
    for (let i = 0; i < employers.length; i++) {
        const employer = await EmployerProfile.findOne({ user_id: employers[i]._id })
        if (employer) {
            let new_data = {
                id: employers[i]._id,
                email: employers[i].email,
                username: employers[i].username,
                company_name: employer.company_name,
                website: employer.website,
                country: employer.address.country
            }
            data.push(new_data)
        }
        else data.push({
            id: employers[i]._id,
            email: employers[i].email,
            username: employers[i].username,
        })

    }
    return resp.status(200).json(data)
}


export const getBlogs = async (req, resp, next) => {
    if (!req.headers['authorization']) return next(HttpErrors.Unauthorized())
    if (jwtDecode(req.headers['authorization']).role !== 'admin') return next(HttpErrors.Unauthorized())
    const data = await Blog.find({})
    return resp.status(200).json(data)
}

export const addBlogs = async (req, resp, next) => {
    if (!req.headers['authorization']) return next(HttpErrors.Unauthorized())
    console.log(jwtDecode(req.headers['authorization']).role)
    if (jwtDecode(req.headers['authorization']).role !== 'admin') return next(HttpErrors.Unauthorized())
    console.log(req.body)
    const { title, content, image } = req.body;

    const wpm = 225;
    const words = content.replace(/(<([^>]+)>)/ig, '').trim().split(/\s+/).length;
    const readtime = Math.ceil(words / wpm);

    const slug = title
    .toLowerCase() // Convert string to lowercase
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^\w-]+/g, '') // Remove non-word characters except hyphens
    .replace(/--+/g, '-') // Replace consecutive hyphens with a single hyphen
    .replace(/^-+|-+$/g, '');
    Blog.create({ title: title, content: content, readtime: readtime,slug:slug }, (err, doc) => {
        if (err) {
            console.log(err)
            return resp.status(400).json({ message: 'Blog not saved!' })
        }
        else if (doc) {
            let base64Image = image.split(';base64,').pop();
            fs.writeFile(dir.replace('Controllers', 'public/blog_images/') + `${doc._id}.png`, base64Image, 'base64', function (err) {
                console.log(err);
            });
            return resp.status(201).json({ message: "Blog saved successfully." })
        }
    })
}
export const updateBlogs = async (req, resp, next) => {
    if (!req.headers['authorization']) return next(HttpErrors.Unauthorized())
    console.log(jwtDecode(req.headers['authorization']).role)
    if (jwtDecode(req.headers['authorization']).role !== 'admin') return next(HttpErrors.Unauthorized())
    console.log(req.body)
    const { title, content, image,id } = req.body;
        const wpm = 225;
        const words = content.replace(/(<([^>]+)>)/ig, '').trim().split(/\s+/).length;
        const readtime = Math.ceil(words / wpm);

        const slug = title
    .toLowerCase() // Convert string to lowercase
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^\w-]+/g, '') // Remove non-word characters except hyphens
    .replace(/--+/g, '-') // Replace consecutive hyphens with a single hyphen
    .replace(/^-+|-+$/g, '');
    Blog.findOneAndUpdate({ id: id }, { title: title, content: content, readtime: readtime,slug:slug }, (err, doc) => {
        if (err) {
            console.log(err)
            return resp.status(400).json({ message: 'Blog not saved!' })
        }
        else if (doc) {
            let base64Image = image.split(';base64,').pop();
            fs.writeFile(dir.replace('Controllers', 'public/blog_images/') + `${doc._id}.png`, base64Image, 'base64', function (err) {
                console.log(err);
            });
            return resp.status(201).json({ message: "Blog saved successfully." })
        }
    })
}