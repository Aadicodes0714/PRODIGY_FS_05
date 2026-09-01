import { useRef, useState } from "react";
import API from "../services/api";

function CreatePost({ onPostCreated }) {

    const fileInputRef = useRef(null);

    const [caption, setCaption] = useState("");
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    const handleFileChange = (e) => {

        const selectedFile = e.target.files[0];

        if (!selectedFile) return;

        setFile(selectedFile);

        setPreview(URL.createObjectURL(selectedFile));

        setError("");
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!caption.trim() && !file) {
            setError("Please write something or select a photo/video.");
            return;
        }

        try {

            setLoading(true);
            setError("");
            setSuccess("");

            const formData = new FormData();

            formData.append("caption", caption);

            if (file) {
                formData.append("media", file);
            }

            const token = localStorage.getItem("token");

            const response = await API.post(
                "/posts",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setSuccess("Post created successfully! 🎉");

            setCaption("");
            setFile(null);
            setPreview("");

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            // Tell Home page to refresh feed
            if (onPostCreated) {
                onPostCreated(response.data.post);
            }

        } catch (error) {

            console.error("CREATE POST ERROR:", error);

            setError(
                error.response?.data?.message ||
                "Failed to create post"
            );

        } finally {

            setLoading(false);

        }
    };


    return (
        <div className="create-post-card">

            <h2>Create a Post</h2>

            <form onSubmit={handleSubmit}>

                <textarea
                    placeholder="What's on your mind?"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    maxLength={2000}
                />

                {preview && (
                    <div className="post-preview">

                        {file?.type.startsWith("video/") ? (

                            <video
                                src={preview}
                                controls
                            />

                        ) : (

                            <img
                                src={preview}
                                alt="Preview"
                            />

                        )}

                    </div>
                )}


                <div className="create-post-actions">

                    <label className="media-button">

                        📷 Add Photo / 🎥 Video

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleFileChange}
                            hidden
                        />

                    </label>


                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Posting..." : "🚀 Post"}
                    </button>

                </div>


                {error && (
                    <p className="form-error">
                        {error}
                    </p>
                )}

                {success && (
                    <p className="form-success">
                        {success}
                    </p>
                )}

            </form>

        </div>
    );
}

export default CreatePost;