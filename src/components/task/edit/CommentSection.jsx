import React, {useState} from "react";
import FormInput from "../../FormInput.jsx";
import axios from "axios";
import {useToasts} from "react-toast-notifications";

const CommentSection = ({taskId, userDetails}) => {
    const {addToast} = useToasts();

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [editing, setEditing] = useState(null);
    const [editedComment, setEditedComment] = useState("");

    const handleAddComment = async () => {
        if (newComment.trim()) {
            setComments([
                ...comments,
                {id: Date.now(), text: newComment, replies: []},
            ]);
            try {
                const response = await axios.post(`/tasks/${taskId}/comments`, {
                    comment: newComment
                })
                const created = response?.data?.body?.status

                if (created) {
                    addToast('Comment Added', {appearance: 'success'});
                    setNewComment("");
                } else {
                    addToast('Failed to add the comment', {appearance: 'error'});
                }
            } catch (error) {
                addToast('Failed to add the comment', {appearance: 'error'});
            }
        } else {
            addToast('Comment is required', {appearance: 'warning'});
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
            <div className="flex gap-5 items-center">
                <div
                    className="w-10 h-10 rounded-full bg-primary-pink flex items-center justify-center text-white text-lg font-semibold">
                    {userDetails.firstName?.[0]}{userDetails.lastName?.[0]}
                </div>
                <div className={"w-9/12"}>
                    <FormInput
                        type="text"
                        name="comment"
                        showLabel={false}
                        formValues={{comment: newComment}}
                        placeholder="Add a comment..."
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                </div>
                <div className=" flex items-center justify-center cursor-pointer btn-primary text-center w-20"
                     onClick={handleAddComment}>
                    <p>Post</p>
                </div>
            </div>
            <div className={'mt-6'}>
                {comments.map((comment) => (
                    <div key={comment.id} className="mb-4">
                        {editing === comment.id ? (
                            <div>
                                <FormInput
                                    type="text"
                                    name="editedComment"
                                    formValues={{editedComment: editedComment}}
                                    onChange={(e) => setEditedComment(e.target.value)}
                                />
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
                            <div className={"flex w-full justify-between"}>
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
