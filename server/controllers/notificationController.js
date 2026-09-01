const Notification = require("../models/Notification");

// ==========================
// GET MY NOTIFICATIONS
// ==========================

const getNotifications = async (req, res) => {
    try {

        const notifications = await Notification.find({
            recipient: req.user._id
        })
        .populate(
            "sender",
            "name username profilePicture"
        )
        .sort({
            createdAt: -1
        });

        res.status(200).json({
            notifications
        });

    } catch (error) {

        console.error(
            "GET NOTIFICATIONS ERROR:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==========================
// MARK NOTIFICATION AS READ
// ==========================

const markAsRead = async (req, res) => {
    try {

        const notification =
            await Notification.findOne({
                _id: req.params.id,
                recipient: req.user._id
            });

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found"
            });
        }

        notification.isRead = true;

        await notification.save();

        res.status(200).json({
            message: "Notification marked as read"
        });

    } catch (error) {

        console.error(
            "MARK READ ERROR:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    getNotifications,
    markAsRead
};