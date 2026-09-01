const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        caption: {
            type: String,
            trim: true,
            maxlength: 2000
        },

        mediaUrl: {
            type: String,
            default: ""
        },

        mediaType: {
            type: String,
            enum: ["image", "video", "none"],
            default: "none"
        },

        tags: [
            {
                type: String,
                lowercase: true,
                trim: true
            }
        ],

        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Post", postSchema);