const express = require("express");

const {
    getNotifications,
    markAsRead
} = require("../controllers/notificationController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================
// GET MY NOTIFICATIONS
// ==========================

router.get(
    "/",
    protect,
    getNotifications
);


// ==========================
// MARK AS READ
// ==========================

router.put(
    "/:id/read",
    protect,
    markAsRead
);


module.exports = router;