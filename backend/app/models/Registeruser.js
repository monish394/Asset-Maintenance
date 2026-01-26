import mongoose from "mongoose";

const Userschema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
     email:{
        type:String,
        required:true
    },
     password:{
        type:String,
        required:true
    },
     phone:{
        type:String,
        required:true
    },
     address:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["admin","user","technician"],
        default:"user"
    }
},{timestamps:true})

 const User=mongoose.model("User",Userschema);
 export default User