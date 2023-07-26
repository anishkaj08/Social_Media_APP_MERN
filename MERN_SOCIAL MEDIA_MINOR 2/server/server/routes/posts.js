import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts); //gives you every single post present in database
router.get("/:userId/posts", verifyToken, getUserPosts);  //gives this user's post only

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);

export default router;