import express from "express";
const router = express.Router();
import { login , logout , signup , updateProfilePic } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { checkAuth } from "../controllers/auth.controller.js";

router.post("/login", login);
router.post("/logout" , logout)
router.post("/signup" , signup)

router.put("/update-ProfilePic" , protectRoute , updateProfilePic);
router.get("/authUser" , protectRoute , checkAuth);



export default router;

