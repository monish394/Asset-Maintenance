import joi from "joi"

const Registervalidation=new joi.object({
    name:joi.string().min(3).max(30).trim().required(),
    email:joi.string().email().trim().required(),
    password:joi.string().min(8).max(15).trim().required(),
    address:joi.string().min(10).max(30).trim().required(),
    phone:joi.string().min(10).max(10).trim().required(),
    role:joi.string()
})
export default Registervalidation