import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.post("/register", 
    upload.single('profileImage'),
    registerUser
);
router.post("/login", loginUser)
router.post("/logout", verifyJWT, logoutUser)

export default router;