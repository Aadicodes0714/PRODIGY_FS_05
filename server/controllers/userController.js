const User = require("../models/User");
const Notification = require("../models/Notification");


// ==========================
// GET USER PROFILE
// ==========================

const getUserProfile = async (req, res) => {
    try {

        const user = await User.findOne({
            username: req.params.username
        }).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            user
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==========================
// UPDATE MY PROFILE
// ==========================

const updateProfile = async (req, res) => {
    try {

        const { name, bio, profilePicture } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Update only provided fields
        if (name !== undefined) {
            user.name = name;
        }

        if (bio !== undefined) {
            user.bio = bio;
        }

        if (profilePicture !== undefined) {
            user.profilePicture = profilePicture;
        }

        await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
                bio: user.bio
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==========================
// FOLLOW USER
// ==========================

const followUser = async (req, res) => {
    try {

        const targetUserId = req.params.id;
        const currentUserId = req.user._id;

        // Cannot follow yourself
        if (
            targetUserId.toString() ===
            currentUserId.toString()
        ) {
            return res.status(400).json({
                message: "You cannot follow yourself"
            });
        }


        const targetUser = await User.findById(
            targetUserId
        );

        const currentUser = await User.findById(
            currentUserId
        );


        if (!targetUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }


        if (!currentUser) {
            return res.status(404).json({
                message: "Current user not found"
            });
        }


        // Check already following
        const alreadyFollowing =
            currentUser.following.some(
                id =>
                    id.toString() ===
                    targetUserId.toString()
            );


        if (alreadyFollowing) {
            return res.status(400).json({
                message:
                    "You are already following this user"
            });
        }


        // ==========================
        // ADD FOLLOW RELATIONSHIP
        // ==========================

        // Add target to current user's following
        currentUser.following.push(
            targetUserId
        );


        // Add current user to target's followers
        targetUser.followers.push(
            currentUserId
        );


        await currentUser.save();
        await targetUser.save();


        // ==========================
        // CREATE FOLLOW NOTIFICATION
        // ==========================

        await Notification.create({

            recipient: targetUser._id,

            sender: currentUser._id,

            type: "follow",

            message:
                `${currentUser.name} started following you`

        });


        // ==========================
        // RESPONSE
        // ==========================

        res.status(200).json({

            message:
                "User followed successfully",

            following: true,

            followersCount:
                targetUser.followers.length

        });


    } catch (error) {

        console.error(
            "FOLLOW ERROR:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==========================
// UNFOLLOW USER
// ==========================

const unfollowUser = async (req, res) => {
    try {

        const targetUserId = req.params.id;
        const currentUserId = req.user._id;


        const targetUser = await User.findById(
            targetUserId
        );

        const currentUser = await User.findById(
            currentUserId
        );


        if (!targetUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }


        if (!currentUser) {
            return res.status(404).json({
                message: "Current user not found"
            });
        }


        const isFollowing =
            currentUser.following.some(
                id =>
                    id.toString() ===
                    targetUserId.toString()
            );


        if (!isFollowing) {
            return res.status(400).json({
                message:
                    "You are not following this user"
            });
        }


        // Remove target from following
        currentUser.following =
            currentUser.following.filter(
                id =>
                    id.toString() !==
                    targetUserId.toString()
            );


        // Remove current user from target's followers
        targetUser.followers =
            targetUser.followers.filter(
                id =>
                    id.toString() !==
                    currentUserId.toString()
            );


        await currentUser.save();
        await targetUser.save();


        res.status(200).json({

            message:
                "User unfollowed successfully",

            following: false,

            followersCount:
                targetUser.followers.length

        });


    } catch (error) {

        console.error(
            "UNFOLLOW ERROR:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==========================
// GET USERS FOR SUGGESTIONS
// ==========================

const getAllUsers = async (req, res) => {
    try {

        const currentUserId = req.user._id;


        const users = await User.find({

            _id: {
                $ne: currentUserId
            }

        })
        .select("-password")
        .limit(10);


        res.status(200).json({
            users
        });


    } catch (error) {

        console.error(
            "GET USERS ERROR:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==========================
// EXPORT
// ==========================

module.exports = {

    getUserProfile,

    updateProfile,

    followUser,

    unfollowUser,

    getAllUsers

};