const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();

const allowedExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".gif",
    ".mp4",
    ".webm",
    ".mov"
];

const upload = multer({
    storage: storage,

    limits: {
        fileSize: 50 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {

        const extension = path
            .extname(file.originalname)
            .toLowerCase();

        const isImageOrVideo =
            file.mimetype?.startsWith("image/") ||
            file.mimetype?.startsWith("video/");

        const isAllowedExtension =
            allowedExtensions.includes(extension);

        if (isImageOrVideo || isAllowedExtension) {
            cb(null, true);
        } else {
            cb(new Error("Only image and video files are allowed"));
        }
    }
});

module.exports = upload;