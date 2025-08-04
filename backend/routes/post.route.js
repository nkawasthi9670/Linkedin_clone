import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createComment, createPost, deletePost, getFeedPosts, getPostById, likePost, getUserPosts  } from "../controllers/post.controller.js";

const router=express.Router();

router.get("/",protectRoute,getFeedPosts);
router.post("/create",protectRoute,createPost);
router.delete("/delete/:id",protectRoute,deletePost);
router.get("/:id",protectRoute,getPostById);
router.post("/:id/comment",protectRoute,createComment);
router.post("/:id/like",protectRoute,likePost);
router.get("/user/:userId", protectRoute, getUserPosts);

export default router;