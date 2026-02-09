// import mongoose from "mongoose";
import axios from "axios";
import bcryptjs from "bcryptjs"
import jsonwebtoken from "jsonwebtoken"
import User from "../models/Registeruser.js";
import Registervalidation from "../validators/Registervalidation.js";
import Loginvalidation from "../validators/Loginvalidation.js";
const UserCtrl = {}
async function geocodeAddress(address) {
  try {
    const res = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: { q: address, format: "json", limit: 1 },
    });

    if (res.data.length > 0) {
      const lon = parseFloat(res.data[0].lon);
      const lat = parseFloat(res.data[0].lat);
      if (!isNaN(lon) && !isNaN(lat)) {
        return [lon, lat];
      }
    }

    console.log(`Geocoding failed for address: "${address}"`);
    return null; 
  } catch (err) {
    console.log("Geocoding error:", err.message);
    return null;
  }
}



UserCtrl.Registeruser = async (req, res) => {
    const body = req.body;
    const { error, value } = Registervalidation.validate(body, { abortEarly: false })
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }



    console.log(body)
    try {
        const Emailpresent =await User.findOne({ email: value.email })
        if (Emailpresent) {
            return res.json({ err: "Email already taken enter uniqueone!!!" })
        }
        const countdoc = await User.countDocuments()
        if (countdoc === 0) {
            value.role = "admin"
        }

        const Newuser = new User(value)
        const salt=await bcryptjs.genSalt(10)
        const hashpassword=await bcryptjs.hash(Newuser.password,salt)
        Newuser.password=hashpassword;
        console.log(salt)
        await Newuser.save()
        res.status(201).json(Newuser)



    } catch (err) {
        console.log(err)
        res.status(500).json({ err: "Something went wrong While Adding Users!!!" })
    }

}


//check user login credentials
UserCtrl.Loginuser=async (req,res) => {
    const body=req.body;
    const {error,value}=Loginvalidation.validate(body,{abortEarly:false})
    if(error){
        return res.status(400).json({ error: error.details[0].message });
    }

    try{
        const user=await User.findOne({email:value.email});
        if(!user){
            return res.json({err:"Invalid Email!!"})
        }
        const isMatch=await bcryptjs.compare(value.password,user.password)
        if(!isMatch){
            return res.status(400).json({err:"Invalid Password!!"})
        }
        const tokendata={userid:user._id,role:user.role};
        const token=jsonwebtoken.sign(tokendata,process.env.JWT_SECRET,{expiresIn:"10d"})
        

        res.status(200).json({message:"Login successful",token:token,role:tokendata.role})


    }catch(err){
        console.log(err)
        res.status(400).json({err:"something went wrong while Login!!"})
    }
    
}


//dashbord route
UserCtrl.dashboardRoute=async (req,res) => {
    try{
        const user=await User.findById(req.userid)
        if(!user){
            res.status(404).json({err:"user not found!"})
        }
        res.json(user)

    }catch(err){
        console.log(err)
        res.json({err:"something went wrong in dashboard route!!!"})
    }
    
}


//user record needed by admin route

UserCtrl.FindAllUser=async (req,res) => {

    try{
        const user=await User.find({role:"user"})
    res.status(200).json(user);

    }catch(err){
        console.log(err.message)
        res.status(400).json({err:"something went wrong while feching users!!!"})

    }
    
    
}
UserCtrl.FindAllTechnician=async (req,res) => {
    try{
        const findtechnician=await User.find({role:"technician"})
        res.status(200).json(findtechnician)

    }catch(err){
        console.log(err.message)
        res.status(400).json({err:"something went wrong while fetching Technicians!!!"})
    }
    
}

UserCtrl.DeleteUser=async (req,res) => {
    const id=req.params.id;
    try{
        const deleteuser=await User.findByIdAndDelete(id)
        res.status(200).json(deleteuser)

    }catch(err){
        console.log(err)
        res.status(400).json({err:"something went wrong while deleting user!!"})
    }
    
}


UserCtrl.EditUser=async (req,res) => {
    const id=req.params.id;
    const {name,email,phone,address}=req.body;

    try{
        const updateduser=await User.findByIdAndUpdate(id,{name,email,phone,address},{new:true})
        res.status(200).json(updateduser)

    }catch(err){
        console.log(err.message)
        res.status(400).josn({err:"something went wrong wile edit user!!"})
    }
    
}


UserCtrl.GetuserInfo=async (req,res) => {

    try{
        const user=await User.findById(req.userid)
        res.status(200).json(user)

    }catch(err){
        res.status(200).json({err:"something went wrong fetch user info!!"})
        console.log(err.message)
    }
    
}



//get nerby technician route

UserCtrl.getNearbyTechnicians = async (req, res) => {
  try {
    const user = await User.findById(req.userid);

    if (!user?.location?.coordinates || user.location.coordinates.length !== 2) {
      return res.status(400).json({ error: "User location not found" });
    }

    const [lng, lat] = user.location.coordinates;

    const technicians = await User.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [lng, lat] },
          distanceField: "distance",
          spherical: true,
          maxDistance: 5000,
          query: { role: "technician" }
        }
      }
    ]);

    res.json(technicians);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};







//gettechcoordinates



UserCtrl.updateTechCoordinates = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    const usersToUpdate = await User.find({
      role: { $in: ["user", "technician"] },
      $or: [
        { "location": { $exists: false } },
        { "location.coordinates": { $size: 0 } },
        { "location.coordinates": [0, 0] },
      ],
    });

    if (usersToUpdate.length === 0) {
      return res.status(200).json({ message: "No users or technicians need updating." });
    }

    let updatedCount = 0;

    for (let user of usersToUpdate) {
      if (!user.address) {
        console.log(`Skipping ${user.name}, no address available`);
        continue;
      }

      const coords = await geocodeAddress(user.address);

      if (!coords || coords.length !== 2) {
        console.log(`Skipping ${user.name}, invalid geocode result`);
        continue;
      }

      user.location = { type: "Point", coordinates: coords };
      await user.save();
      updatedCount++;
      console.log(`Updated ${user.name}: ${coords}`);
    }

    res.status(200).json({
      message: `Updated coordinates for ${updatedCount} users/technicians successfully.`,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Failed to update user and technician coordinates." });
  }
};


UserCtrl.UserLocation=async (req, res) => {
  try {
    const user = await User.findById(req.userid);
    if (!user || !user.location || !user.location.coordinates)
      return res.status(404).json({ error: "Coordinates not found" });

    res.status(200).json({
      lat: user.location.coordinates[1],
      lng: user.location.coordinates[0],
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user location" });
  }
}

export default UserCtrl