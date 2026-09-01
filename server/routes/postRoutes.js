const express = require("express");

const {
    createPost,
    getPosts,
    getPost,
    deletePost,
    toggleLike,
    getFeed
} = require("../controllers/postController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/", getPosts);
router.get(
    "/feed",
    protect,
    getFeed
);
router.get("/:id", getPost);

router.post(
    "/",
    protect,
    upload.single("media"),
    createPost
);
// Like / Unlike post
router.post(
    "/:id/like",
    protect,
    toggleLike
);
router.delete(
    "/:id",
    protect,
    deletePost
);

module.exports = router;