import { genrateToken } from "../lib/util.js";
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

export const signup = async (req , res) => {
    const {fullName , email , password} = req.body;
    try {
        
        if(password.length < 6){
            return res.status(404).json({ message : "password length is short"})
        }
        
        const user = await User.findOne({email})
        
        if(user) return res.status(404).json({message : "Email already exist please try with different email"})
            
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password , salt)
            
            const newUser = new User({
                fullName,
                email,
                password : hashedPassword
            })
            
            if(newUser){
                genrateToken(newUser._id , res);
                await newUser.save();
                
                res.status(201).json({
                    _id : newUser._id,
                    fullName : newUser.fullName,
                    email : newUser.email,
                    profilePic : newUser.profilePic
                });
            }
            else{
                return res.send(404).json({message : "The data you entered is invalid"})
            }
    } catch (error) {
           console.log("Error while signUp" + error.message);
            res.send(500).json({message : "Internal Server Error" + error})
    }
}

export const login = async (req, res) => {
    try {
        
        const {email , password} = req.body
        
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message : "Invalid Credential"});
        }
        
        const isCorrectPassword = await bcrypt.compare(password , user.password);
        if(!isCorrectPassword){
        res.status(400).json({message : "Invalid Credential"})
        }
        
        genrateToken(user._id , res);
        
        res.status(200).json({
        id : user._id,
        fullName : user.fullName,
        email : user.email,
        password : user.password,
        profilePic : user.profilePic
        });

    } catch (error) {
        console.log("An Error Occured" + error.message);
        res.status(500).json({message : "Internal Server error"});   
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("jwt" , "" , {maxAge : 0})
        res.status(200).json({message : "You are logged out successfully"})
    } catch (error) {
        console.log("Some Error Occurred" + error);
        res.status(500).json({message : "Internal Server error"})
    }
}

export const updateProfilePic = async (req , res) => {
    try {
        const {profilePic} = req.body;
        const userId = req.user._id

        if(!profilePic){
            return res.status(404).json({message : "profile picture is required"})
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId ,  {profilePic :uploadResponse} , {new : true})

        res.status(200).json(updatedUser)
    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Internal Server Error"})
    }
}

export const authUser = (req , res) => {
    try {
        res.status(200).json({message : req.user})
    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Internal Server Error"})
    }
}