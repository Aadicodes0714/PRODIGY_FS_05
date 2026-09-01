import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Explore() {

    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [followingUsers, setFollowingUsers] = useState({});


    // ==========================
    // FETCH USERS
    // ==========================

    const fetchUsers = async () => {

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

            setUsers(response.data.users || []);

        } catch (error) {

            console.error(
                "EXPLORE ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load users"
            );

        } finally {

            setLoading(false);

        }
    };


    // ==========================
    // LOAD USERS
    // ==========================

    useEffect(() => {

        fetchUsers();

    }, []);


    // ==========================
    // FOLLOW / UNFOLLOW
    // ==========================

    const handleFollow = async (userId) => {

        try {

            const token =
                localStorage.getItem("token");

            const isFollowing =
                followingUsers[userId] === true;


            if (isFollowing) {

                await API.post(
                    `/users/${userId}/unfollow`,
                    {},
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

                setFollowingUsers((prev) => ({
                    ...prev,
                    [userId]: false
                }));

            } else {

                await API.post(
                    `/users/${userId}/follow`,
                    {},
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
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
    // SEARCH USERS
    // ==========================

    const filteredUsers = users.filter((user) => {

        const query =
            search.toLowerCase().trim();

        if (!query) {
            return true;
        }

        return (
            user.name
                ?.toLowerCase()
                .includes(query) ||

            user.username
                ?.toLowerCase()
                .includes(query)
        );

    });


    // ==========================
    // LOADING
    // ==========================

    if (loading) {

        return (
            <div className="loading">
                Loading Explore...
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

        <div className="explore-page">


            {/* =========================
                HEADER
            ========================= */}

            <div className="explore-header">

                <h1>
                    🔍 Explore
                </h1>

                <p>
                    Discover new people on SocialSphere
                </p>

            </div>


            {/* =========================
                SEARCH
            ========================= */}

            <div className="explore-search">

                <input
                    type="text"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

            </div>


            {/* =========================
                USERS
            ========================= */}

            <div className="explore-users">

                {filteredUsers.length === 0 ? (

                    <div className="no-results">

                        <h3>
                            No users found 😶
                        </h3>

                        <p>
                            Try another name or username.
                        </p>

                    </div>

                ) : (

                    filteredUsers.map((user) => (

                        <div
                            className="explore-user-card"
                            key={user._id}
                        >


                            {/* PROFILE */}

                            <div
                                className="explore-user-info"
                                onClick={() =>
                                    navigate(
                                        `/profile/${user.username}`
                                    )
                                }
                            >

                                <div className="explore-avatar">

                                    {user.profilePicture ? (

                                        <img
                                            src={
                                                user.profilePicture
                                            }
                                            alt={user.username}
                                        />

                                    ) : (

                                        user.name
                                            ?.charAt(0)
                                            .toUpperCase()

                                    )}

                                </div>


                                <div>

                                    <strong>
                                        {user.name}
                                    </strong>

                                    <span>
                                        @{user.username}
                                    </span>

                                </div>

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
                                    : "Follow"}

                            </button>


                        </div>

                    ))

                )}

            </div>

        </div>

    );
}

export default Explore;