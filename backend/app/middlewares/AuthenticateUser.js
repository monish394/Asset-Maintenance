import jwt from "jsonwebtoken"



export const AuthenticateUser=(req,res,next)=>{

    try{
        const token= req.headers["authorization"]
    if(!token){
        res.status(401).json({err:"token not provided!!!"}) 
    }
    const tokendata=jwt.verify(token,process.env.JWT_SECRET)
    req.userid=tokendata.userid
    req.role=tokendata.role
    next();
    }catch(err){
       res.status(403).json({ err: "Invalid or expired token" })

    }
    

} 