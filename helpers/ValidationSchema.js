import joi from 'joi'

export const loginSchema = joi.object({
    email:joi.string().email().lowercase().required(),
    password: joi.string().min(8).required(),
})

export const registerSchema = joi.object({
    email:joi.string().email().lowercase().required(),
    password: joi.string().min(8).required(),
    username:joi.string().lowercase().alphanum().required(),
    role:joi.string().valid('employer','candidate','admin').required().messages(
        {'any.only':'Not Authorized'}
    )
})