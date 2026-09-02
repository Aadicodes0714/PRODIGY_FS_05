import { useEffect, useState } from "react";
import API from "../services/api";

function CommentSection({ postId }) {

    const [comments, setComments] = useState([]);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    // ==========================
    // GET COMMENTS
    // ==========================

    const fetchComments = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await API.get(
                `/posts/${postId}/comments`
            );

            setComments(response.data.comments || []);

        } catch (error) {

            console.error("COMMENTS ERROR:", error);

            setError(
                error.response?.data?.message ||
                "Unable to load comments"
            );

        } finally {

            setLoading(false);

        }
    };


    // ==========================
    // ADD COMMENT
    // ==========================

    const handleComment = async (e) => {

        e.preventDefault();

        if (!text.trim()) {
            return;
        }

        try {

            setSubmitting(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await API.post(
                `/posts/${postId}/comments`,
                {
                    text: text.trim()
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // Add new comment at the top
            setComments((prevComments) => [
                response.data.comment,
                ...prevComments
            ]);

            // Clear input
            setText("");

        } catch (error) {

            console.error("ADD COMMENT ERROR:", error);

            setError(
                error.response?.data?.message ||
                "Failed to add comment"
            );

        } finally {

            setSubmitting(false);

        }
    };


    // ==========================
    // DELETE COMMENT
    // ==========================

    const handleDelete = async (commentId) => {

        try {

            const token = localStorage.getItem("token");

            await API.delete(
                `/comments/${commentId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // Remove deleted comment from UI
            setComments((prevComments) =>
                prevComments.filter(
                    (comment) => comment._id !== commentId
                )
            );

        } catch (error) {

            console.error("DELETE COMMENT ERROR:", error);

            setError(
                error.response?.data?.message ||
                "Failed to delete comment"
            );

        }
    };


    // ==========================
    // LOAD COMMENTS
    // ==========================

    useEffect(() => {

        fetchComments();

    }, [postId]);


    return (

        <div className="comment-section">


            {/* COMMENTS */}

            {loading ? (

                <p className="comment-loading">
                    Loading comments...
                </p>

            ) : (

                <>

                    {comments.length === 0 ? (

                        <p className="no-comments">
                            No comments yet. Be the first! 💬
                        </p>

                    ) : (

                        <div className="comments-list">

                            {comments.map((comment) => (

                                <div
                                    className="comment"
                                    key={comment._id}
                                >

                                    <div className="comment-avatar">

                                        {comment.user?.name
                                            ?.charAt(0)
                                            .toUpperCase()}

                                    </div>


                                    <div className="comment-content">

                                        <div className="comment-header">

                                            <strong>
                                                {comment.user?.name}
                                            </strong>

                                            <span>
                                                @{comment.user?.username}
                                            </span>

                                        </div>


                                        <p>
                                            {comment.text}
                                        </p>


                                        <button
                                            className="delete-comment"
                                            onClick={() =>
                                                handleDelete(comment._id)
                                            }
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </>

            )}


            {/* ERROR */}

            {error && (

                <p className="comment-error">
                    {error}
                </p>

            )}


            {/* ADD COMMENT */}

            <form
                className="comment-form"
                onSubmit={handleComment}
            >

                <input
                    type="text"
                    placeholder="Write a comment..."
                    value={text}
                    onChange={(e) =>
                        setText(e.target.value)
                    }
                    maxLength={500}
                />

                <button
                    type="submit"
                    disabled={submitting || !text.trim()}
                >
                    {submitting ? "..." : "Post"}
                </button>

            </form>


        </div>

    );
}

export default CommentSection;