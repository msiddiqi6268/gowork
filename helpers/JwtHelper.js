import jwt from "jsonwebtoken";
import HttpErrors from 'http-errors';
import RefreshToken from "../Models/RefreshToken.js";
export const signAccessToken = (user) => {
    const {user_id} = user
    return new Promise((resolve, reject) => {
        const payload = {
            role:user.role,
            username:user.username,
            email:user.email
        }
        const options = {
            expiresIn: '1h',
            issuer: 'gowork.pk',
            audience: user.user_id ? user.user_id:user.aud
        }
        jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, options, (err, token) => {
            if (err) {
                console.log(err)
                reject(HttpErrors.InternalServerError())
            }
            resolve(token)
        })
    })
}


export const signRefreshToken = (user) => {
    return new Promise((resolve, reject) => {
        const payload = {
            role:user.role,
            username:user.username,
            email:user.email
        }
        const options = {
            expiresIn: '365d',
            issuer: 'gowork.pk',
            audience: user.user_id ? user.user_id:user.aud
        }
        jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, options, async (err, token) => {
            if (err) { reject(HttpErrors.InternalServerError()) }
            const uid = user.user_id?user.user_id:user.aud
            const doesExist  = await RefreshToken.findOne({id:uid})
            if(doesExist){
                RefreshToken.deleteOne({user_id:uid})
            }
            await RefreshToken.create({user_id:uid,token})
            resolve(token)
        })
    })
}

export const verifyAccessToken = (req, res, next) => {
    if (!req.headers['authorization']) return next(HttpErrors.Unauthorized())
    const authHeader = req.headers['authorization']
    const bearerToken = authHeader.split(' ')
    const token = bearerToken[1]
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) {
            const message =
                err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
            return next(HttpErrors.Unauthorized(message))
        }
        req.payload = payload
        next()
    })
}

export const verifyRefreshToken = (refreshToken) => {
    const privateKey = process.env.REFRESH_TOKEN_SECRET;
    return new Promise((resolve, reject) => {
        RefreshToken.findOne({ token: refreshToken }, (err, doc) => {
            if (!doc)
                return reject({ error: true, message: "Invalid refresh token" });
            jwt.verify(refreshToken, privateKey, (err, tokenDetails) => {
                if (err)
                    return reject({ error: true, message: "Invalid refresh token" });
                resolve({
                    tokenDetails,
                    error: false,
                    message: "Valid refresh token",
                });
            });
        });
    });
};


