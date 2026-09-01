const Post = require("../models/Post");

const cloudinary = require("../config/cloudinary");

const path = require("path");

const User = require("../models/User");
const uploadToCloudinary = (fileBuffer, resourceType) => {
    return new Promise((resolve, reject) => {

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: resourceType,
                folder: "socialsphere"
            },
            (error, result) => {

                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        uploadStream.end(fileBuffer);
    });
};
// ==========================
// CREATE POST
// ==========================
const createPost = async (req, res) => {

    try {

        // req.body may be undefined with multipart/form-data
        const { caption = "" } = req.body || {};

        const file = req.file;

        // Post must contain either text or media
        if (!caption.trim() && !file) {
            return res.status(400).json({
                message: "Post cannot be empty"
            });
        }

        let mediaUrl = "";
        let mediaType = "none";


        // ==========================
        // HANDLE IMAGE / VIDEO
        // ==========================

        if (file) {

            const extension = path
                .extname(file.originalname)
                .toLowerCase();

            // Detect video using BOTH MIME type and extension
            const videoExtensions = [
                ".mp4",
                ".webm",
                ".mov",
                ".avi",
                ".mkv"
            ];

            const isVideo =
                file.mimetype?.startsWith("video/") ||
                videoExtensions.includes(extension);


            const resourceType = isVideo
                ? "video"
                : "image";


            console.log("Uploading file:", {
                name: file.originalname,
                mimetype: file.mimetype,
                extension: extension,
                resourceType: resourceType
            });


            const result = await uploadToCloudinary(
                file.buffer,
                resourceType
            );


            mediaUrl = result.secure_url;

            mediaType = resourceType;
        }


        // ==========================
        // EXTRACT HASHTAGS
        // ==========================

        const tags = caption
            ? (caption.match(/#[a-zA-Z0-9_]+/g) || [])
                .map(tag =>
                    tag.substring(1).toLowerCase()
                )
            : [];


        // ==========================
        // CREATE POST
        // ==========================

        const post = await Post.create({

            user: req.user._id,

            caption: caption.trim(),

            mediaUrl,

            mediaType,

            tags

        });


        // Populate user information
        const populatedPost = await Post
            .findById(post._id)
            .populate(
                "user",
                "name username profilePicture"
            );


        res.status(201).json({

            message: "Post created successfully",

            post: populatedPost

        });


    } catch (error) {

        console.error("CREATE POST ERROR:", error);

        res.status(500).json({
            message: "Failed to create post",
            error: error.message
        });
    }
};
// ==========================
// GET ALL POSTS
// ==========================

const getPosts = async (req, res) => {

    try {

        const posts = await Post
            .find()
            .populate(
                "user",
                "name username profilePicture"
            )
            .sort({ createdAt: -1 });

        res.status(200).json({
            posts
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==========================
// GET SINGLE POST
// ==========================

const getPost = async (req, res) => {

    try {

        const post = await Post
            .findById(req.params.id)
            .populate(
                "user",
                "name username profilePicture"
            );

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        res.status(200).json({
            post
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==========================
// DELETE POST
// ==========================

const deletePost = async (req, res) => {

    try {

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        // Only owner can delete
        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You can only delete your own posts"
            });
        }

        await post.deleteOne();

        res.status(200).json({
            message: "Post deleted successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};
// ==========================
// LIKE / UNLIKE POST
// ==========================

const toggleLike = async (req, res) => {
    try {

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        const userId = req.user._id;

        // Check if user already liked the post
        const alreadyLiked = post.likes.some(
            (id) => id.toString() === userId.toString()
        );

        if (alreadyLiked) {

            // Unlike
            post.likes = post.likes.filter(
                (id) => id.toString() !== userId.toString()
            );

        } else {

            // Like
            post.likes.push(userId);
        }

        await post.save();

        res.status(200).json({
            message: alreadyLiked
                ? "Post unliked"
                : "Post liked",

            likesCount: post.likes.length,

            liked: !alreadyLiked
        });

    } catch (error) {

        console.error("LIKE ERROR:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

// ==========================
// GET PERSONALIZED FEED
// ==========================

const getFeed = async (req, res) => {
    try {

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const usersToShow = [
            req.user._id,
            ...user.following
        ];

        const posts = await Post
            .find({
                user: { $in: usersToShow }
            })
            .populate(
                "user",
                "name username profilePicture"
            )
            .sort({ createdAt: -1 });

        res.status(200).json({
            posts
        });

    } catch (error) {

        console.error("FEED ERROR:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};
module.exports = {
    createPost,
    getPosts,
    getPost,
    deletePost,
    toggleLike,
    getFeed
};