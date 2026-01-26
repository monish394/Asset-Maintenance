import mongoose from "mongoose"


export const ConfigureDB=()=>{
    try{
        mongoose.connect(process.env.MONGO_URL)
        console.log("Connected to DB")

    }catch(err){
        console.log(err)
    }
}