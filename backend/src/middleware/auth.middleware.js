// We can also call this method as auth.protect.js since this method is providing protectio

// Now let's understand what is the use of this 
// this is basically middleware . Let say any user wants to send the message or update the profilepic then it must be validate user to do that

// so before going to actuall update page we require to first check that the user which is updating it must be valid user and that is done basically with the help of the auth.middleware.js

import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

export const protectRoute = async (req, res , next) => {
    try {
        const token = req.cookies.jwt;

        if(!token){
            return res.status(404).json({message : "unauthorised error can't identify user"});
        }

        const decoded = jwt.verify( token , process.env.JWT_SECRET);

        if(!decoded){
            return res.status(404).json({message : "the credentials are invalid"});
        }

        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            return res.status(404).json({message : "User not found"});
        }
        req.user = user;

        next();
    } catch (error) {
        console.log(error);
        return res.send(500).json({message : "Internal Server error"});
    }
}