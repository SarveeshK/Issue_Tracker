import React, { useEffect, useState } from 'react';
import { issueService } from '../services/api';
import type { CommentDto, CreateCommentDto } from '../types';
import { useAuth } from '../context/AuthContext';

interface Props {
    issueId?: number;
    taskId?: number;
}

export const CommentsSection: React.FC<Props> = ({ issueId, taskId }) => {
    const { user } = useAuth();
    const [comments, setComments] = useState<CommentDto[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Reply State
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [replyText, setReplyText] = useState('');
    const [replying, setReplying] = useState(false);

    useEffect(() => {
        loadComments();
    }, [issueId, taskId]);

    const loadComments = async () => {
        if (!issueId && !taskId) return;
        setLoading(true);
        try {
            let data: CommentDto[] = [];
            if (issueId) {
                data = await issueService.getIssueComments(issueId);
            } else if (taskId) {
                data = await issueService.getTaskComments(taskId);
            }
            setComments(data);
        } catch (error) {
            console.error('Failed to load comments', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !user) return;

        setSubmitting(true);
        try {
            const dto: CreateCommentDto = {
                userId: user.userId,
                commentText: newComment,
                taskId: taskId,
                issueId: issueId,
                parentCommentId: null
            };
            await issueService.createComment(dto);
            setNewComment('');
            loadComments();
        } catch (error) {
            console.error('Failed to post comment', error);
            alert('Failed to post comment');
        } finally {
            setSubmitting(false);
        }
    };

    const handleReplySubmit = async (e: React.FormEvent, parentId: number) => {
        e.preventDefault();
        if (!replyText.trim() || !user) return;

        setReplying(true);
        try {
            const dto: CreateCommentDto = {
                userId: user.userId,
                commentText: replyText,
                taskId: taskId,
                issueId: issueId,
                parentCommentId: parentId
            };
            await issueService.createComment(dto);
            setReplyText('');
            setReplyingTo(null);
            loadComments();
        } catch (error) {
            console.error('Failed to post reply', error);
            alert('Failed to post reply');
        } finally {
            setReplying(false);
        }
    };

    const renderComment = (comment: CommentDto) => (
        <div key={comment.commentId} className="flex gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm mb-4">
            <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100">
                    {comment.userName.charAt(0)}
                </div>
            </div>
            <div className="flex-grow">
                <div className="flex justify-between items-start mb-1">
                    <div>
                        <span className="font-bold text-slate-900 block">{comment.userName}</span>
                        <span className="text-xs text-slate-400">{new Date(comment.createdDate).toLocaleString()}</span>
                    </div>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{comment.commentText}</p>

                {/* Reply Button */}
                <div className="mt-2">
                    <button
                        onClick={() => {
                            setReplyingTo(comment.commentId);
                            setReplyText(''); // Clear previous text
                        }}
                        className="text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-1"
                    >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                        Reply
                    </button>
                </div>

                {/* Reply Form */}
                {replyingTo === comment.commentId && (
                    <form onSubmit={(e) => handleReplySubmit(e, comment.commentId)} className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="relative">
                            <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder={`Replying to ${comment.userName}...`}
                                className="w-full text-sm p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none resize-y min-h-[60px]"
                                autoFocus
                                required
                            />
                            <div className="flex justify-end gap-2 mt-2">
                                <button
                                    type="button"
                                    onClick={() => setReplyingTo(null)}
                                    className="px-3 py-1 text-xs font-bold text-slate-500 hover:text-slate-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={replying || !replyText.trim()}
                                    className="bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-bold hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {replying ? 'Posting...' : 'Post Reply'}
                                </button>
                            </div>
                        </div>
                    </form>
                )}

                {/* Recursive Replies */}
                {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 pl-4 border-l-2 border-slate-100">
                        {comment.replies.map(renderComment)}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Discussion ({comments.length} top-level)
            </h3>

            {/* Main Comment Form */}
            <form onSubmit={handleSubmit} className="premium-card p-4 bg-slate-50/50">
                <div className="relative">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="input-field min-h-[100px] resize-y py-3"
                        required
                    />
                    <div className="absolute bottom-3 right-3">
                        <button
                            type="submit"
                            disabled={submitting || !newComment.trim()}
                            className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                        >
                            {submitting ? 'Posting...' : 'Post Comment'}
                        </button>
                    </div>
                </div>
            </form>

            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-blue-600 mx-auto"></div>
                    </div>
                ) : comments.length > 0 ? (
                    comments.map(renderComment)
                ) : (
                    <p className="text-center text-slate-400 py-10 italic">No comments yet. Be the first to start the discussion!</p>
                )}
            </div>
        </div>
    );
};
