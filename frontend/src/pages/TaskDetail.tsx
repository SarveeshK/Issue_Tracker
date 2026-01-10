import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { issueService } from '../services/api';
import type { TaskDto, CommentDto } from '../types';
import { CommentThread } from '../components/CommentThread';

export const TaskDetail: React.FC = () => {
    const { taskId } = useParams<{ taskId: string }>();
    const [task, setTask] = useState<TaskDto | null>(null);
    const [comments, setComments] = useState<CommentDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (taskId) {
            loadData(parseInt(taskId));
        }
    }, [taskId]);

    const loadData = async (id: number) => {
        try {
            const [taskData, commentsData] = await Promise.all([
                issueService.getTaskById(id),
                issueService.getComments(id)
            ]);
            setTask(taskData);
            setComments(commentsData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const refreshComments = () => {
        if (taskId) {
            issueService.getComments(parseInt(taskId)).then(setComments);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Task...</div>;
    if (!task) return <div className="p-8 text-center text-red-500">Task not found</div>;

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <div className="mb-4">
                <Link to={`/issues/${task.issueId}`} className="text-blue-600 hover:underline text-sm">
                    &larr; Back to Issue
                </Link>
            </div>

            <div className="bg-white shadow rounded-lg p-6 mb-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-gray-900">{task.taskTitle}</h1>
                            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-semibold">
                                {task.statusName}
                            </span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                            Assigned to: <span className="font-medium text-gray-700">{task.assignedToName || 'Unassigned'}</span>
                        </div>
                    </div>
                </div>
                <div className="prose max-w-none text-gray-700 border-t pt-4">
                    <p>{task.taskDescription}</p>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <CommentThread taskId={task.taskId} comments={comments} onCommentAdded={refreshComments} />
            </div>
        </div>
    );
};
