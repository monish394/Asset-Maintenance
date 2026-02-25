import joi from "joi"

const Registervalidation = new joi.object({
    name: joi.string().min(3).max(30).trim().required(),
    email: joi.string().email().trim().required(),
    password: joi.string().min(8).max(15).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,15}$')).trim().required().messages({
        'string.pattern.base': 'Password must be 8-15 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character',
    }),
    address: joi.string().min(10).max(30).trim().required(),
    phone: joi.string().min(10).max(10).trim().required(),
    role: joi.string(),
    profile: joi.string().allow("").optional()
})
export default Registervalidation