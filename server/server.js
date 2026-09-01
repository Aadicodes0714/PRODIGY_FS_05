const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const commentRoutes = require("./routes/commentRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

const PORT = process.env.PORT || 5000;


// ==========================
// DATABASE
// ==========================

connectDB();


// ==========================
// MIDDLEWARE
// ==========================

app.use(
    cors({
        origin: process.env.FRONTEND_URL || "*",
        credentials: true
    })
);

app.use(express.json());


// ==========================
// ROUTES
// ==========================

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/posts", postRoutes);

app.use("/api", commentRoutes);

app.use(
    "/api/notifications",
    notificationRoutes
);


// ==========================
// HEALTH CHECK
// ==========================

app.get("/", (req, res) => {

    res.status(200).json({
        message: "SocialSphere API is running 🚀"
    });

});


// ==========================
// 404 HANDLER
// ==========================

app.use((req, res) => {

    res.status(404).json({
        message: "API route not found"
    });

});


// ==========================
// GLOBAL ERROR HANDLER
// ==========================

app.use((err, req, res, next) => {

    console.error("SERVER ERROR:", err);

    res.status(500).json({
        message: "Internal server error"
    });

});


// ==========================
// START SERVER
// ==========================

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});