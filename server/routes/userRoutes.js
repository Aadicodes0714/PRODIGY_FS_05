const express = require("express");

const {
    getUserProfile,
    updateProfile,
    followUser,
    unfollowUser,
    getAllUsers
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================
// GET USER SUGGESTIONS
// ==========================

router.get(
    "/suggestions",
    protect,
    getAllUsers
);


// ==========================
// PUBLIC USER PROFILE
// ==========================

router.get(
    "/:username",
    getUserProfile
);


// ==========================
// UPDATE MY PROFILE
// ==========================

router.put(
    "/profile",
    protect,
    updateProfile
);


// ==========================
// FOLLOW USER
// ==========================

router.post(
    "/:id/follow",
    protect,
    followUser
);


// ==========================
// UNFOLLOW USER
// ==========================

router.post(
    "/:id/unfollow",
    protect,
    unfollowUser
);


module.exports = router;