

import { User } from "../models/user.model.js";

import bcrypt from "bcryptjs";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import jwt from "jsonwebtoken";



// getting data from the body logic start from here
export const register = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password, role } = req.body;

    if (!fullName || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
    });

    return res.status(201).json({
      message: "User registered successfully",
      success: true,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

//login all logic start home here
export const login=async(req,res)=>{
    try{

        const {email,password,role}=req.body;
        if(!email || !password || !role){
            return res.status(400).json({
                message:"something is missing",
                success:false
            });
        };

        let user=await User.findOne({email});


        if (!user){
            return res.status(400).json({
                message:"user not found",
                success:false
            });     
        };
        
        const isPasswordMatch=await bcrypt.compare(password,user.password);
        if (!isPasswordMatch){
            return res.status(400).json({
                message:"incorrect email of password",
                success:false
            })
        }
        if (role!==user.role){
            return res.status(400).json({
                message:"you are not authorized",
                success:false
            });
        };
        const tokenData={
            userId:user._id,
            email:user.email,
            role:user.role
        }
        const token=await jwt.sign(tokenData,process.env.JWT_SECRET,{expiresIn:"1d"})
        user={
            _id :user._id,
            fullName:user.fullName,
            email:user.email,
            phoneNumber:user.phoneNumber,
            role:user.role,
            profile:user.profile
        }
        return res.status(200).cookie("token",token,{
            maxAge:24*60*60*1000,
            httpOnly: true,
            sameSite:"Strict"
        }).json({
            message:`Login successful ${user.fullName}`,
            user,
            success:true
        });
    }
    catch(error){
          console.log(error)
    }
}
//logout all logic start from here
export const logout=async(req,res)=>{
    try{
       return res.status(200).cookie("token","",{
        maxAge:0
       }).json({
        message:"logout successful",
        success:true
       })
        
    }catch(error){

    }
}
// here is the logic of the update profile
export const updateProfile=async(req,res)=>{
    try{
         // for getting the user updated user data
        const {fullName,email,phoneNumber,bio,skills}=req.body;



        if (skills) {
            const skillsArray = skills.split(",");
        }

        const userId = req.id;

        // now finding the user id for updating the profile
        let user = await User.findById(userId);
       // if user id not found the  
        if (!user){
            return res.status(400).json({
                message:"user not found",
                success:false
            })
        }

        // updating the use data
        if(fullName)user.fullName=fullName;
        if(email)user.email=email;
        if(phoneNumber)user.phoneNumber=phoneNumber;
        if(bio)user.profile.bio=bio;
        if(skills)user.profile.skills=skillsArray;
        // saving the user data
        await user.save()
        user={
            _id:user._id,
            fullName:user.fullName, 
            email:user.email,
            phoneNumber:user.phoneNumber,
            role:user.role,
            profile:user.profile

        }
        // if every thing is ok then show this message
        return res.status(200).json({
            message:"profile updated succesfully",
            user,
            success:true
        })


    }catch(error){
        console.log(error)
    }
}