import { useEffect, useState } from "react";
import API from "../services/api";
import CreatePost from "../components/CreatePost";
import CommentSection from "../components/ CommentSection";

function Home() {

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Like state
    const [likedPosts, setLikedPosts] = useState({});

    // Comments open/close state
    const [openComments, setOpenComments] = useState({});

    // Suggestions
    const [suggestions, setSuggestions] = useState([]);

    // Following state
    const [followingUsers, setFollowingUsers] = useState({});


    // ==========================
    // FETCH FEED
    // ==========================

    const fetchFeed = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await API.get(
                "/posts/feed",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setPosts(response.data.posts || []);

        } catch (error) {

            console.error("FEED ERROR:", error);

            setError(
                error.response?.data?.message ||
                "Unable to load feed"
            );

        } finally {

            setLoading(false);

        }
    };


    // ==========================
    // FETCH USER SUGGESTIONS
    // ==========================

    const fetchSuggestions = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await API.get(
                "/users/suggestions",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const users = response.data.users || [];

            setSuggestions(users);

        } catch (error) {

            console.error(
                "SUGGESTIONS ERROR:",
                error
            );

        }
    };


    // ==========================
    // LIKE / UNLIKE
    // ==========================

    const handleLike = async (postId) => {

        try {

            const token = localStorage.getItem("token");

            const response = await API.post(
                `/posts/${postId}/like`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const { likesCount, liked } = response.data;


            // Update liked state

            setLikedPosts((prev) => ({
                ...prev,
                [postId]: liked
            }));


            // Update likes count

            setPosts((prevPosts) =>
                prevPosts.map((post) => {

                    if (post._id !== postId) {
                        return post;
                    }

                    return {
                        ...post,
                        likes: Array(likesCount).fill(null)
                    };

                })
            );


        } catch (error) {

            console.error(
                "LIKE ERROR:",
                error
            );

        }
    };


    // ==========================
    // FOLLOW / UNFOLLOW
    // ==========================

    const handleFollow = async (userId) => {

        try {

            const token = localStorage.getItem("token");

            const isFollowing =
                followingUsers[userId] === true;


            if (isFollowing) {

                // ======================
                // UNFOLLOW
                // ======================

                await API.post(
                    `/users/${userId}/unfollow`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );


                setFollowingUsers((prev) => ({
                    ...prev,
                    [userId]: false
                }));


            } else {

                // ======================
                // FOLLOW
                // ======================

                await API.post(
                    `/users/${userId}/follow`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );


                setFollowingUsers((prev) => ({
                    ...prev,
                    [userId]: true
                }));

            }

        } catch (error) {

            console.error(
                "FOLLOW ERROR:",
                error
            );

        }
    };


    // ==========================
    // LOAD DATA
    // ==========================

    useEffect(() => {

        fetchFeed();
        fetchSuggestions();

    }, []);


    // ==========================
    // LOADING
    // ==========================

    if (loading) {

        return (
            <div className="loading">
                Loading your feed...
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


    // ==========================
    // MAIN UI
    // ==========================

    return (

        <div className="feed-container">


            {/* =========================
                LEFT SIDEBAR
            ========================= */}

            <aside className="sidebar">

                <h2>SocialSphere</h2>

                <nav>

                    <a href="/">
                        🏠 Home
                    </a>

                    <a href="/explore">
                        🔍 Explore
                    </a>

                   <a href={`/profile/${localStorage.getItem("username")}`}>
    👤 Profile
</a>
                    <a href="/notifications">
                        🔔 Notifications
                    </a>

                </nav>

            </aside>



            {/* =========================
                MAIN FEED
            ========================= */}

            <section className="feed">


                {/* FEED HEADER */}

                <div className="feed-header">

                    <h1>Your Feed</h1>

                </div>


                {/* =========================
                    CREATE POST
                ========================= */}

                <CreatePost
                    onPostCreated={(newPost) => {

                        setPosts((prevPosts) => [
                            newPost,
                            ...prevPosts
                        ]);

                    }}
                />


                {/* =========================
                    POSTS
                ========================= */}

                {posts.length === 0 ? (

                    <div className="empty-feed">

                        <h2>
                            No posts yet 😶
                        </h2>

                        <p>
                            Follow some users to see their posts.
                        </p>

                    </div>

                ) : (

                    posts.map((post) => (

                        <div
                            className="post-card"
                            key={post._id}
                        >


                            {/* =========================
                                USER INFO
                            ========================= */}

                            <div className="post-user">

                                <div className="avatar">

                                    {post.user?.profilePicture ? (

                                        <img
                                            src={post.user.profilePicture}
                                            alt=""
                                        />

                                    ) : (

                                        post.user?.name
                                            ?.charAt(0)
                                            .toUpperCase()

                                    )}

                                </div>


                                <div>

                                    <strong>
                                        {post.user?.name}
                                    </strong>

                                    <span>
                                        @{post.user?.username}
                                    </span>

                                </div>

                            </div>



                            {/* =========================
                                CAPTION
                            ========================= */}

                            {post.caption && (

                                <p className="post-caption">
                                    {post.caption}
                                </p>

                            )}



                            {/* =========================
                                IMAGE
                            ========================= */}

                            {post.mediaType === "image" && (

                                <img
                                    className="post-media"
                                    src={post.mediaUrl}
                                    alt="Post"
                                />

                            )}



                            {/* =========================
                                VIDEO
                            ========================= */}

                            {post.mediaType === "video" && (

                                <video
                                    className="post-media"
                                    src={post.mediaUrl}
                                    controls
                                />

                            )}



                            {/* =========================
                                ACTIONS
                            ========================= */}

                            <div className="post-actions">


                                {/* LIKE */}

                                <button
                                    onClick={() =>
                                        handleLike(post._id)
                                    }
                                >

                                    {likedPosts[post._id]
                                        ? "❤️"
                                        : "🤍"
                                    }

                                    {" "}

                                    {post.likes?.length || 0}

                                </button>


                                {/* COMMENTS */}

                                <button
                                    onClick={() =>
                                        setOpenComments((prev) => ({
                                            ...prev,
                                            [post._id]:
                                                !prev[post._id]
                                        }))
                                    }
                                >

                                    💬 Comment

                                </button>


                            </div>



                            {/* =========================
                                COMMENT SECTION
                            ========================= */}

                            {openComments[post._id] && (

                                <CommentSection
                                    postId={post._id}
                                />

                            )}


                        </div>

                    ))

                )}

            </section>



            {/* =========================
                RIGHT SIDEBAR
            ========================= */}

            <aside className="right-sidebar">

                <div className="suggestions">

                    <h3>
                        People you may know
                    </h3>


                    {suggestions.length === 0 ? (

                        <p>
                            No suggestions available.
                        </p>

                    ) : (

                        <div className="suggestion-list">

                            {suggestions.map((user) => (

                                <div
                                    className="suggestion-user"
                                    key={user._id}
                                >


                                    {/* PROFILE IMAGE */}

                                    <div className="suggestion-avatar">

                                        {user.profilePicture ? (

                                            <img
                                                src={user.profilePicture}
                                                alt={user.name}
                                            />

                                        ) : (

                                            user.name
                                                ?.charAt(0)
                                                .toUpperCase()

                                        )}

                                    </div>


                                    {/* USER INFO */}

                                    <div className="suggestion-info">

                                        <strong>
                                            {user.name}
                                        </strong>

                                        <span>
                                            @{user.username}
                                        </span>

                                    </div>


                                    {/* FOLLOW BUTTON */}

                                    <button
                                        className={
                                            followingUsers[user._id]
                                                ? "following-button"
                                                : "follow-button"
                                        }
                                        onClick={() =>
                                            handleFollow(user._id)
                                        }
                                    >

                                        {followingUsers[user._id]
                                            ? "Following ✓"
                                            : "Follow"
                                        }

                                    </button>


                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </aside>


        </div>

    );

}

export default Home;