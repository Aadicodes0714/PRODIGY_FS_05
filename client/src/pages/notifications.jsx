import { useEffect, useState } from "react";
import API from "../services/api";

function Notifications() {

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // ==========================
    // FETCH NOTIFICATIONS
    // ==========================

    const fetchNotifications = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await API.get(
                "/notifications",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setNotifications(
                response.data.notifications || []
            );

        } catch (error) {

            console.error(
                "NOTIFICATIONS ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load notifications"
            );

        } finally {

            setLoading(false);

        }
    };


    // ==========================
    // MARK AS READ
    // ==========================

    const markAsRead = async (notificationId) => {

        try {

            const token = localStorage.getItem("token");

            await API.put(
                `/notifications/${notificationId}/read`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            // Update UI
            setNotifications((prev) =>
                prev.map((notification) =>
                    notification._id === notificationId
                        ? {
                            ...notification,
                            isRead: true
                        }
                        : notification
                )
            );

        } catch (error) {

            console.error(
                "MARK READ ERROR:",
                error
            );

        }
    };


    // ==========================
    // LOAD
    // ==========================

    useEffect(() => {

        fetchNotifications();

    }, []);


    // ==========================
    // LOADING
    // ==========================

    if (loading) {

        return (
            <div className="loading">
                Loading notifications...
            </div>
        );

    }


    // ==========================
    // ERROR
    // ==========================

    if (error) {

        return (
            <div className="error">
                {error}
            </div>
        );

    }


    return (

        <div className="notifications-page">

            <div className="notifications-container">


                {/* HEADER */}

                <div className="notifications-header">

                    <h1>
                        🔔 Notifications
                    </h1>

                    <p>
                        Stay updated with your activity.
                    </p>

                </div>


                {/* EMPTY */}

                {notifications.length === 0 ? (

                    <div className="no-notifications">

                        <div className="empty-icon">
                            🔔
                        </div>

                        <h2>
                            No notifications yet
                        </h2>

                        <p>
                            When someone follows, likes or
                            comments on your posts, you'll
                            see it here.
                        </p>

                    </div>

                ) : (


                    /* NOTIFICATION LIST */

                    <div className="notification-list">

                        {notifications.map(
                            (notification) => (

                                <div
                                    key={notification._id}
                                    className={
                                        notification.isRead
                                            ? "notification-item read"
                                            : "notification-item unread"
                                    }
                                    onClick={() =>
                                        !notification.isRead &&
                                        markAsRead(
                                            notification._id
                                        )
                                    }
                                >


                                    {/* SENDER AVATAR */}

                                    <div className="notification-avatar">

                                        {notification.sender
                                            ?.profilePicture ? (

                                            <img
                                                src={
                                                    notification
                                                        .sender
                                                        .profilePicture
                                                }
                                                alt=""
                                            />

                                        ) : (

                                            notification.sender
                                                ?.name
                                                ?.charAt(0)
                                                .toUpperCase()

                                        )}

                                    </div>


                                    {/* CONTENT */}

                                    <div className="notification-content">

                                        <p>
                                            <strong>
                                                {notification.sender
                                                    ?.name}
                                            </strong>

                                            {" "}

                                            {notification.type ===
                                                "follow" &&
                                                "started following you"}

                                            {notification.type ===
                                                "like" &&
                                                "liked your post ❤️"}

                                            {notification.type ===
                                                "comment" &&
                                                "commented on your post 💬"}
                                        </p>


                                        <span>
                                            {new Date(
                                                notification.createdAt
                                            ).toLocaleString()}
                                        </span>

                                    </div>


                                    {/* UNREAD DOT */}

                                    {!notification.isRead && (

                                        <div className="unread-dot">
                                            ●
                                        </div>

                                    )}

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>

        </div>

    );
}

export default Notifications;