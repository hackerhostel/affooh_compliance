import React, {useState} from "react";

const CommentSection = () => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [editing, setEditing] = useState(null);
    const [editedComment, setEditedComment] = useState("");

    const handleAddComment = () => {
        if (newComment.trim()) {
            setComments([
                ...comments,
                {id: Date.now(), text: newComment, replies: []},
            ]);
            setNewComment("");
        }
    };

    const handleDeleteComment = (id) => {
        setComments(comments.filter((comment) => comment.id !== id));
    };

    const handleEditComment = (id, text) => {
        setEditing(id);
        setEditedComment(text);
    };

    const handleSaveEdit = (id) => {
        setComments(
            comments.map((comment) =>
                comment.id === id ? {...comment, text: editedComment} : comment
            )
        );
        setEditing(null);
        setEditedComment("");
    };

    const handleReply = (id, replyText) => {
        setComments(
            comments.map((comment) =>
                comment.id === id
                    ? {...comment, replies: [...comment.replies, {text: replyText}]}
                    : comment
            )
        );
    };

    return (
        <div className="w-full mt-8 p-6 bg-white rounded-lg shadow-lg flex-col">
            <div className="flex gap-5">
        <textarea
            className="w-full p-2 border rounded"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
        ></textarea>
                <div className="cursor-pointer" onClick={handleAddComment}>
                    Post
                </div>
            </div>
            <div>
                {comments.map((comment) => (
                    <div key={comment.id} className="mb-4">
                        {editing === comment.id ? (
                            <div>
                <textarea
                    className="w-full p-2 border rounded"
                    value={editedComment}
                    onChange={(e) => setEditedComment(e.target.value)}
                ></textarea>
                                <button
                                    className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
                                    onClick={() => handleSaveEdit(comment.id)}
                                >
                                    Save
                                </button>
                                <button
                                    className="mt-2 ml-2 px-4 py-2 bg-gray-500 text-white rounded"
                                    onClick={() => setEditing(null)}
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <div>
                                <p className="mb-2">{comment.text}</p>
                                <div className="space-x-2">
                                    <button
                                        className="text-blue-500"
                                        onClick={() => handleEditComment(comment.id, comment.text)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="text-red-500"
                                        onClick={() => handleDeleteComment(comment.id)}
                                    >
                                        Delete
                                    </button>
                                    <button
                                        className="text-green-500"
                                        onClick={() =>
                                            handleReply(
                                                comment.id,
                                                prompt("Enter your reply:", "")
                                            )
                                        }
                                    >
                                        Reply
                                    </button>
                                </div>
                            </div>
                        )}
                        {comment.replies.length > 0 && (
                            <div className="ml-4 mt-2 space-y-2">
                                {comment.replies.map((reply, index) => (
                                    <div
                                        key={index}
                                        className="p-2 border-l-2 border-gray-200"
                                    >
                                        <p>{reply.text}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommentSection;
