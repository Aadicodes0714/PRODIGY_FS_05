const Comment = require("../models/Comment");
const Post = require("../models/Post");
const User = require("../models/User");

// ==========================
// CREATE COMMENT
// ==========================

const createComment = async (req, res) => {
    try {

        const { text } = req.body;
        const { postId } = req.params;

        if (!text || !text.trim()) {
            return res.status(400).json({
                message: "Comment cannot be empty"
            });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        const comment = await Comment.create({
            post: postId,
            user: req.user._id,
            text: text.trim()
        });

        const populatedComment = await Comment
            .findById(comment._id)
            .populate(
                "user",
                "name username profilePicture"
            );

        res.status(201).json({
            message: "Comment added successfully",
            comment: populatedComment
        });

    } catch (error) {

        console.error("CREATE COMMENT ERROR:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==========================
// GET COMMENTS
// ==========================

const getComments = async (req, res) => {
    try {

        const { postId } = req.params;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        const comments = await Comment
            .find({ post: postId })
            .populate(
                "user",
                "name username profilePicture"
            )
            .sort({ createdAt: -1 });

        res.status(200).json({
            comments
        });

    } catch (error) {

        console.error("GET COMMENTS ERROR:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==========================
// DELETE COMMENT
// ==========================

const deleteComment = async (req, res) => {
    try {

        const comment = await Comment.findById(
            req.params.commentId
        );

        if (!comment) {
            return res.status(404).json({
                message: "Comment not found"
            });
        }

        // Only comment owner can delete
        if (
            comment.user.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                message: "You can only delete your own comments"
            });
        }

        await comment.deleteOne();

        res.status(200).json({
            message: "Comment deleted successfully"
        });

    } catch (error) {

        console.error("DELETE COMMENT ERROR:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    createComment,
    getComments,
    deleteComment
};