import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { issueService } from '../services/api';
import type { TaskDto, CommentDto } from '../types';
import { CommentThread } from '../components/CommentThread';
import { useAuth } from '../context/AuthContext';

export const TaskDetail: React.FC = () => {
    const { taskId } = useParams<{ taskId: string }>();
    const [task, setTask] = useState<TaskDto | null>(null);
    const [comments, setComments] = useState<CommentDto[]>([]);
    const [users, setUsers] = useState<{ userId: number; name: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [assigning, setAssigning] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const { user } = useAuth();

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

            // Only fetch users if employee (prevent 403)
            if (user?.roleName !== 'User') {
                try {
                    const usersData = await issueService.getUsers();
                    setUsers(usersData);
                } catch (e) { /* ignore forbidden */ }
            }
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
                            <span className={`px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap ${task.statusName === 'Closed' ? 'bg-gray-100 text-gray-800' :
                                    task.statusName === 'Resolved' ? 'bg-orange-100 text-orange-800' :
                                        'bg-green-100 text-green-800'
                                }`}>
                                {task.statusName}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap ${task.priorityName === 'High' ? 'bg-red-100 text-red-800' :
                                task.priorityName === 'Medium' ? 'bg-orange-100 text-orange-800' :
                                    'bg-blue-100 text-blue-800'
                                }`}>
                                {task.priorityName} Priority
                            </span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                            <span>Assigned to:</span>
                            {user?.roleName === 'Admin' ? (
                                <select
                                    className="border rounded px-2 py-1 text-sm text-gray-700 focus:outline-none focus:border-blue-500"
                                    value={users.find(u => u.name === task.assignedToName)?.userId || ''}
                                    onChange={async (e) => {
                                        if (!e.target.value) return;
                                        setAssigning(true);
                                        try {
                                            await issueService.assignTask(task.taskId, parseInt(e.target.value));
                                            // Update local state
                                            const u = users.find(u => u.userId === parseInt(e.target.value));
                                            setTask({ ...task, assignedToName: u?.name ?? null });
                                        } catch (err) {
                                            alert('Failed to assign task');
                                        } finally {
                                            setAssigning(false);
                                        }
                                    }}
                                    disabled={assigning}
                                >
                                    <option value="">Unassigned</option>
                                    {users.map(u => (
                                        <option key={u.userId} value={u.userId}>{u.name}</option>
                                    ))}
                                </select>
                            ) : (
                                <span className="font-semibold text-gray-700">{task.assignedToName || 'Unassigned'}</span>
                            )}
                        </div>
                    </div>
                    {user?.roleName !== 'User' && (
                        <div>
                            {(task.statusName === 'Open' || task.statusName === 'In Progress') ? (
                                <button
                                    onClick={async () => {
                                        const action = user?.roleName === 'Admin' ? 'Close' : 'Submit for Review';
                                        if (!confirm(`${action} this task?`)) return;
                                        setUpdatingStatus(true);
                                        console.log(`Task ${task.taskId}: Attempting to set status to ${user?.roleName === 'Admin' ? 'Closed' : 'Resolved'}...`);
                                        try {
                                            const targetStatus = user?.roleName === 'Admin' ? 'Closed' : 'Resolved';
                                            await issueService.updateTaskStatus(task.taskId, targetStatus);
                                            console.log('Task status updated successfully, re-fetching...');
                                            await loadData(task.taskId);
                                            alert(`Task ${targetStatus === 'Closed' ? 'Closed' : 'Submitted for Review'} successfully!`);
                                        } catch (e: any) {
                                            const msg = e.response?.data?.message || 'Failed to update status';
                                            console.error('Update Task Status Error:', e.response?.data || e.message);
                                            alert(`ERROR: ${msg}`);
                                        }
                                        finally { setUpdatingStatus(false); }
                                    }}
                                    disabled={updatingStatus}
                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors"
                                >
                                    {updatingStatus ? 'Updating...' : (user?.roleName === 'Admin' ? 'Close Task' : 'Submit for Review')}
                                </button>
                            ) : task.statusName === 'Resolved' ? (
                                <div className="flex gap-2">
                                    {user?.roleName === 'Admin' ? (
                                        <button
                                            onClick={async () => {
                                                if (!confirm('Approve and Close this task?')) return;
                                                setUpdatingStatus(true);
                                                console.log(`Task ${task.taskId}: Approving and Closing...`);
                                                try {
                                                    await issueService.updateTaskStatus(task.taskId, 'Closed');
                                                    console.log('Task approved and closed successfully, refreshing...');
                                                    await loadData(task.taskId);
                                                    alert('Task Approved & Closed successfully!');
                                                } catch (e: any) {
                                                    const msg = e.response?.data?.message || 'Failed to close';
                                                    console.error('Approve & Close Error:', e.response?.data || e.message);
                                                    alert(`ERROR: ${msg}`);
                                                }
                                                finally { setUpdatingStatus(false); }
                                            }}
                                            disabled={updatingStatus}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors"
                                        >
                                            {updatingStatus ? 'Closing...' : 'Approve & Close'}
                                        </button>
                                    ) : (
                                        <span className="bg-orange-100 text-orange-800 px-3 py-1.5 rounded text-sm font-medium">Pending Review</span>
                                    )}
                                    <button
                                        onClick={async () => {
                                            if (!confirm('Re-open this task?')) return;
                                            setUpdatingStatus(true);
                                            console.log(`Task ${task.taskId}: Re-opening from Resolved...`);
                                            try {
                                                await issueService.updateTaskStatus(task.taskId, 'Open');
                                                console.log('Task re-opened successfully, refreshing...');
                                                await loadData(task.taskId);
                                                alert('Task Re-opened successfully!');
                                            } catch (e: any) {
                                                const msg = e.response?.data?.message || 'Failed to re-open';
                                                console.error('Re-open Error:', e.response?.data || e.message);
                                                alert(`ERROR: ${msg}`);
                                            }
                                            finally { setUpdatingStatus(false); }
                                        }}
                                        disabled={updatingStatus}
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-sm font-medium transition-colors"
                                    >
                                        {updatingStatus ? 'Opening...' : 'Re-open Task'}
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={async () => {
                                        if (!confirm('Re-open this task? This will also re-open the Issue.')) return;
                                        setUpdatingStatus(true);
                                        try {
                                            await issueService.updateTaskStatus(task.taskId, 'Open');
                                            setTask({ ...task, statusName: 'Open' });
                                        } catch (e: any) {
                                            const msg = e.response?.data?.message || 'Failed to update status';
                                            alert(msg);
                                        }
                                        finally { setUpdatingStatus(false); }
                                    }}
                                    disabled={updatingStatus}
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded text-sm font-medium"
                                >
                                    Re-open Task
                                </button>
                            )}
                        </div>
                    )}
                </div>
                <div className="prose max-w-none text-gray-700 border-t pt-4">
                    <p>{task.taskDescription}</p>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <CommentThread taskId={task.taskId} comments={comments} onCommentAdded={refreshComments} />
            </div>
        </div >
    );
};
