import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

function EditProfile() {

    const { user, login } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState(user?.name || "");
    const [bio, setBio] = useState(user?.bio || "");
    const [profilePicture, setProfilePicture] = useState(
        user?.profilePicture || ""
    );

    const [error, setError] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const token = localStorage.getItem("token");

            const response = await API.put(
                "/users/profile",
                {
                    name,
                    bio,
                    profilePicture
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            login(
                response.data.user,
                token
            );

            navigate(`/profile/${response.data.user.username}`);

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Profile update failed"
            );
        }
    };


    return (
        <div className="auth-container">

            <div className="auth-card">

                <h1>Edit Profile</h1>

                {error && (
                    <p className="error">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                    />

                    <textarea
                        placeholder="Bio"
                        value={bio}
                        onChange={(e) =>
                            setBio(e.target.value)
                        }
                        rows="5"
                    />

                    <input
                        type="text"
                        placeholder="Profile Picture URL"
                        value={profilePicture}
                        onChange={(e) =>
                            setProfilePicture(e.target.value)
                        }
                    />

                    <button type="submit">
                        Save Changes
                    </button>

                </form>

            </div>

        </div>
    );
}

export default EditProfile;