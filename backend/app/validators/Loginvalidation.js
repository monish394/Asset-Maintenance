import joi from "joi"

const Loginvalidation = new joi.object({
    email: joi.string().email().trim().required(),
    password: joi.string().min(8).max(15).trim().required(),
})
export default Loginvalidation