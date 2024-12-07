import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import { getmessage, getUserForSidebar , sendMessage } from "../controllers/message.controller.js";
const router = express();

router.get("/users" , protectRoute , getUserForSidebar);
router.get("/:id" , protectRoute , getmessage);
router.post("/send/:id" , protectRoute , sendMessage)

export default router