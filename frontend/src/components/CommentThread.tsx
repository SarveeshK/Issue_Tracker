import React, { useState } from 'react';
import { issueService } from '../services/api';
import type { CommentDto } from '../types';

interface CommentProps {
    comment: CommentDto;
    taskId: number;
    onCommentAdded: () => void;
}

const timeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
};

const CommentItem: React.FC<CommentProps> = ({ comment, taskId, onCommentAdded }) => {
    const [replying, setReplying] = useState(false);
    const [replyText, setReplyText] = useState('');

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await issueService.createComment({
                taskId,
                userId: 1,
                commentText: replyText,
                parentCommentId: comment.commentId
            });
            setReplyText('');
            setReplying(false);
            onCommentAdded();
        } catch (err) {
            alert('Failed to post reply');
        }
    };

    return (
        <div className="flex gap-3 mb-4 last:mb-0">
            {/* Avatar Area */}
            <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold uppercase">
                    {comment.userName.charAt(0)}
                </div>
            </div>

            <div className="flex-grow">
                {/* Header & Content */}
                <div className="text-sm">
                    <span className="font-semibold text-gray-900 text-xs mr-2">{comment.userName}</span>
                    <span className="text-gray-500 text-xs">{timeAgo(comment.createdDate)}</span>
                    <p className="text-gray-800 mt-0.5 text-sm">{comment.commentText}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 mt-2">
                    <button
                        onClick={() => setReplying(!replying)}
                        className="text-xs font-semibold text-gray-500 hover:text-gray-800 uppercase"
                    >
                        Reply
                    </button>
                    {/* Placeholder for Like */}
                    {/* <button className="text-xs font-semibold text-gray-500 hover:text-gray-800">Like</button> */}
                </div>

                {/* Reply Input */}
                {replying && (
                    <form onSubmit={handleReply} className="mt-3 flex gap-2 items-start animate-fade-in-down">
                        <div className="w-6 h-6 rounded-full bg-gray-300 flex-shrink-0 mt-1 text-[10px] flex items-center justify-center text-gray-600">You</div>
                        <div className="flex-grow">
                            <input
                                autoFocus
                                value={replyText}
                                onChange={e => setReplyText(e.target.value)}
                                placeholder="Add a reply..."
                                className="w-full border-b border-gray-300 focus:border-black outline-none py-1 text-sm bg-transparent transition-colors"
                            />
                            <div className="flex justify-end gap-2 mt-2">
                                <button
                                    type="button"
                                    onClick={() => setReplying(false)}
                                    className="px-3 py-1.5 rounded-full hover:bg-gray-100 text-xs font-medium text-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!replyText.trim()}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium ${replyText.trim() ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-400'}`}
                                >
                                    Reply
                                </button>
                            </div>
                        </div>
                    </form>
                )}

                {/* Nested Replies */}
                {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-2 pl-2">
                        {/* Optional: "View X replies" toggle could go here */}
                        {comment.replies.map(reply => (
                            <CommentItem key={reply.commentId} comment={reply} taskId={taskId} onCommentAdded={onCommentAdded} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

interface ThreadProps {
    taskId: number;
    comments: CommentDto[];
    onCommentAdded: () => void;
}

export const CommentThread: React.FC<ThreadProps> = ({ taskId, comments, onCommentAdded }) => {
    const [newComment, setNewComment] = useState('');

    const handlePostComment = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await issueService.createComment({
                taskId,
                userId: 1,
                commentText: newComment,
                parentCommentId: null
            });
            setNewComment('');
            onCommentAdded();
        } catch (err) {
            alert('Failed to post comment');
        }
    };

    return (
        <div className="mt-8 max-w-2xl">
            <h3 className="font-bold text-lg text-gray-900 mb-6">{comments.length} Comments</h3>

            {/* Top Level Input */}
            <div className="flex gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center text-sm font-bold">
                    Y
                </div>
                <form onSubmit={handlePostComment} className="flex-grow">
                    <input
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="w-full border-b border-gray-300 focus:border-black outline-none py-2 text-sm bg-transparent transition-colors"
                    />
                    <div className={`flex justify-end gap-2 mt-2 ${!newComment && 'hidden'}`}>
                        <button
                            type="button"
                            onClick={() => setNewComment('')}
                            className="px-4 py-2 rounded-full hover:bg-gray-100 text-sm font-medium text-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!newComment.trim()}
                            className="px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400"
                        >
                            Comment
                        </button>
                    </div>
                </form>
            </div>

            {/* Comment List */}
            <div className="space-y-6">
                {comments.map(comment => (
                    <CommentItem key={comment.commentId} comment={comment} taskId={taskId} onCommentAdded={onCommentAdded} />
                ))}
            </div>
        </div>
    );
};
