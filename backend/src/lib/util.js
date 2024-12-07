import jwt from "jsonwebtoken"

export const genrateToken = (userId , res) => {
    const token = jwt.sign({userId} , process.env.JWT_SECRET , {
        expiresIn:"7d"
    });

    res.cookie("jwt" , token ,{
        maxAge  : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true, // just for extra security purpose or to prevent xss attacks
        sameSite : "strict", // to prevent csrf attacks on the web or to prevent cross     site attacks
        secure   : process.env.NODE_ENV !== "development",
    });

    return token;
};