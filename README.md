# PRODIGY_FS_05
here it is the task 5 for full stack web development for prodigy infotech internship programme.

# 🌐 SocialSphere

SocialSphere is a full-stack social media web application where users can create posts, share images/videos, interact with other users, follow people, and receive notifications.

The project is built using the MERN-style stack with React, Node.js, Express.js, MongoDB, JWT authentication, and Cloudinary.

## 🚀 Live Demo

🔗 **Live Application:**  

https://prodigy-fs-05-steel.vercel.app/

🔗 **Backend API:**  

https://prodigy-fs-05-9gjz.onrender.com/

🔗 **GitHub Repository:**  

https://github.com/Aadicodes0714/PRODIGY_FS_05

---

## ✨ Features

### 🔐 Authentication
- User Registration
- User Login
- JWT-based Authentication
- Protected Routes
- Password Hashing using bcryptjs

### 👤 User Profile
- View User Profile
- Edit Profile
- Profile Picture
- Bio and User Information
- Followers and Following Count

### 📝 Posts
- Create Posts
- Upload Images
- Upload Videos
- View Feed
- Delete Posts
- Like / Unlike Posts
- Comments on Posts

### 🤝 Social Features
- Follow Users
- Unfollow Users
- User Suggestions
- Explore Users
- View Other User Profiles

### 🔔 Notifications
- Follow Notifications
- Read / Unread Notification Status
- Mark Notifications as Read

### 📱 UI
- Responsive Design
- Feed Layout
- Sidebar Navigation
- Mobile-Friendly Interface
- Clean Social Media Style UI

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- React Router
- Axios
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Multer

### Cloud Services
- MongoDB Atlas
- Cloudinary
- Render
- Vercel

### Development Tools
- Git
- GitHub
- VS Code
- Postman

---

## 📂 Project Structure

```
PRODIGY_FS_05/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CommentSection.jsx
│   │   │   ├── CreatePost.jsx
│   │   │   ├── Layout.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── home.jsx
│   │   │   ├── login.jsx
│   │   │   ├── register.jsx
│   │   │   ├── profile.jsx
│   │   │   ├── editProfile.jsx
│   │   │   ├── Explore.jsx
│   │   │   └── Notifications.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   ├── vercel.json
│   └── index.html
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
└── README.md
