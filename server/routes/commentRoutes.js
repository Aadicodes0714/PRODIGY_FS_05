const express = require("express");

const {
    createComment,
    getComments,
    deleteComment
} = require("../controllers/commentController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// Create comment
router.post(
    "/posts/:postId/comments",
    protect,
    createComment
);


// Get comments
router.get(
    "/posts/:postId/comments",
    getComments
);


// Delete comment
router.delete(
    "/comments/:commentId",
    protect,
    deleteComment
);


module.exports = router;