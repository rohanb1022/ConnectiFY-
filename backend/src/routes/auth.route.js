import express from "express";
const router = express.Router();
import { login , logout , signup , updateProfilePic } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { authUser } from "../controllers/auth.controller.js";

router.post("/login"  , login);
router.post("/logout" , logout)
router.post("/signup" , signup)

// To update the profilePic we will ask to enter the email and username but we will not allow them to update them

router.put("/update-ProfilePic" , protectRoute , updateProfilePic);
router.get("/authUser" , protectRoute , authUser);



export default router;

