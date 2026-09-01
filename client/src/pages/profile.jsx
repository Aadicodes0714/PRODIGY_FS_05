import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

function Profile() {

    const { username } = useParams();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [isFollowing, setIsFollowing] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);


    // ==========================
    // FETCH PROFILE
    // ==========================

    const fetchProfile = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await API.get(
                `/users/${username}`
            );

            const profileUser = response.data.user;

            setUser(profileUser);

            // Check current user's ID
            const currentUserId =
                localStorage.getItem("userId");

            if (currentUserId && profileUser.followers) {

                const following =
                    profileUser.followers.some(
                        (id) =>
                            id.toString() ===
                            currentUserId.toString()
                    );

                setIsFollowing(following);
            }

        } catch (error) {

            console.error(
                "PROFILE ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load profile"
            );

        } finally {

            setLoading(false);

        }
    };


    // ==========================
    // FOLLOW / UNFOLLOW
    // ==========================

    const handleFollow = async () => {

        try {

            setFollowLoading(true);

            const token =
                localStorage.getItem("token");


            if (isFollowing) {

                // UNFOLLOW

                await API.post(
                    `/users/${user._id}/unfollow`,
                    {},
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

                setIsFollowing(false);

                setUser((prev) => ({
                    ...prev,
                    followers:
                        prev.followers.filter(
                            (id) =>
                                id.toString() !==
                                localStorage.getItem("userId")
                        )
                }));


            } else {

                // FOLLOW

                await API.post(
                    `/users/${user._id}/follow`,
                    {},
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

                setIsFollowing(true);

                setUser((prev) => ({
                    ...prev,
                    followers: [
                        ...prev.followers,
                        localStorage.getItem("userId")
                    ]
                }));

            }

        } catch (error) {

            console.error(
                "FOLLOW ERROR:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to follow user"
            );

        } finally {

            setFollowLoading(false);

        }
    };


    // ==========================
    // LOAD PROFILE
    // ==========================

    useEffect(() => {

        fetchProfile();

    }, [username]);


    // ==========================
    // LOADING
    // ==========================

    if (loading) {

        return (
            <div className="loading">
                Loading profile...
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


    if (!user) {
        return null;
    }


    // ==========================
    // MAIN UI
    // ==========================

    return (

        <div className="profile-page">

            <div className="profile-card">


                {/* =========================
                    PROFILE PICTURE
                ========================= */}

                <div className="profile-picture">

                    {user.profilePicture ? (

                        <img
                            src={user.profilePicture}
                            alt={user.username}
                        />

                    ) : (

                        <div className="default-avatar">

                            {user.name
                                ?.charAt(0)
                                .toUpperCase()}

                        </div>

                    )}

                </div>


                {/* =========================
                    NAME
                ========================= */}

                <h1>
                    {user.name}
                </h1>


                {/* USERNAME */}

                <p className="username">
                    @{user.username}
                </p>


                {/* BIO */}

                <p className="bio">

                    {user.bio ||
                        "No bio yet."}

                </p>


                {/* =========================
                    FOLLOW BUTTON
                ========================= */}

                <button
                    className={
                        isFollowing
                            ? "profile-following-button"
                            : "profile-follow-button"
                    }
                    onClick={handleFollow}
                    disabled={followLoading}
                >

                    {followLoading
                        ? "Please wait..."
                        : isFollowing
                            ? "Following ✓"
                            : "Follow"}

                </button>


                {/* =========================
                    PROFILE STATS
                ========================= */}

                <div className="profile-stats">


                    <div>

                        <strong>
                            {user.postsCount || 0}
                        </strong>

                        <span>
                            Posts
                        </span>

                    </div>


                    <div>

                        <strong>
                            {user.followers?.length || 0}
                        </strong>

                        <span>
                            Followers
                        </span>

                    </div>


                    <div>

                        <strong>
                            {user.following?.length || 0}
                        </strong>

                        <span>
                            Following
                        </span>

                    </div>

                </div>

            </div>

        </div>

    );
}

export default Profile;