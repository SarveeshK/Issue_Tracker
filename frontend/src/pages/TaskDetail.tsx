import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { issueService } from '../services/api';
import type { TaskDto } from '../types';
import { CommentsSection } from '../components/CommentsSection';
import { ActivityTimeline } from '../components/ActivityTimeline';
import { useAuth } from '../context/AuthContext';

export const TaskDetail: React.FC = () => {
    const { taskId } = useParams<{ taskId: string }>();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();

    // State
    const [task, setTask] = useState<TaskDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [users, setUsers] = useState<{ userId: number; name: string }[]>([]);
    const [assigning, setAssigning] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [showActivity, setShowActivity] = useState(false);
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        loadTask();
    }, [taskId]);

    const loadTask = async () => {
        if (!taskId) return;
        setLoading(true);
        try {
            const id = parseInt(taskId);
            const [taskData, logsData] = await Promise.all([
                issueService.getTaskById(id),
                issueService.getTaskLogs(id)
            ]);
            setTask(taskData);
            setLogs(logsData);

            // Fetch users for assignment if not client
            if (currentUser?.roleName !== 'User') {
                try {
                    const usersData = await issueService.getUsers();
                    setUsers(usersData);
                } catch (e) { console.error('Failed to load users', e); }
            }
        } catch (err) {
            setError('Failed to load task details');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Open': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'In Progress': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'Resolved': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Closed': return 'bg-slate-100 text-slate-600 border-slate-200';
            default: return 'bg-indigo-100 text-indigo-700 border-indigo-200';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'High': return 'bg-red-100 text-red-800 border-red-200';
            case 'Medium': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'Low': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
        </div>
    );

    if (error || !task) return (
        <div className="container mx-auto p-6 text-center">
            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 inline-block">
                {error || 'Task not found'}
            </div>
            <button onClick={handleBack} className="block mx-auto mt-4 text-blue-600 hover:underline">Go Back</button>
        </div>
    );

    return (
        <div className="container mx-auto p-6 max-w-5xl">
            <button onClick={handleBack} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-6 font-bold text-sm transition-colors group">
                <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="premium-card p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-2xl font-extrabold text-slate-900 leading-tight">{task.taskTitle}</h1>
                                <div className="flex items-center gap-3 mt-3">
                                    <span className={`badge border ${getStatusColor(task.statusName)}`}>{task.statusName}</span>
                                    <span className={`badge border ${getPriorityColor(task.priorityName)}`}>{task.priorityName} Priority</span>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">#{task.taskId}</span>
                                </div>
                            </div>
                        </div>

                        <div className="prose prose-slate max-w-none mb-8">
                            <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest mb-3">Description</h3>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-700 leading-relaxed text-sm">
                                {task.taskDescription}
                            </div>
                        </div>

                        {/* Action Buttons (Status Updates) */}
                        {currentUser?.roleName !== 'User' && (
                            <div className="flex gap-4 border-t border-slate-100 pt-6">
                                {(task.statusName === 'Open' || task.statusName === 'In Progress') ? (
                                    <button
                                        onClick={async () => {
                                            const action = currentUser?.roleName === 'Admin' ? 'Close' : 'Submit for Review';
                                            if (!window.confirm(`${action} this task?`)) return;
                                            setUpdatingStatus(true);
                                            try {
                                                const targetStatus = currentUser?.roleName === 'Admin' ? 'Closed' : 'Resolved';
                                                await issueService.updateTaskStatus(task.taskId, targetStatus);
                                                loadTask();
                                            } catch (e: any) {
                                                alert(e.response?.data?.message || 'Failed to update status');
                                            } finally { setUpdatingStatus(false); }
                                        }}
                                        disabled={updatingStatus}
                                        className="btn-primary"
                                    >
                                        {updatingStatus ? 'Updating...' : (currentUser?.roleName === 'Admin' ? 'Close Task' : 'Submit for Review')}
                                    </button>
                                ) : task.statusName === 'Resolved' ? (
                                    <>
                                        {currentUser?.roleName === 'Admin' && (
                                            <button
                                                onClick={async () => {
                                                    if (!window.confirm('Approve and Close this task?')) return;
                                                    setUpdatingStatus(true);
                                                    try {
                                                        await issueService.updateTaskStatus(task.taskId, 'Closed');
                                                        loadTask();
                                                    } catch (e: any) {
                                                        alert(e.response?.data?.message || 'Failed to close');
                                                    } finally { setUpdatingStatus(false); }
                                                }}
                                                disabled={updatingStatus}
                                                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700"
                                            >
                                                {updatingStatus ? 'Closing...' : 'Approve & Close'}
                                            </button>
                                        )}
                                        <button
                                            onClick={async () => {
                                                if (!window.confirm('Re-open this task?')) return;
                                                setUpdatingStatus(true);
                                                try {
                                                    await issueService.updateTaskStatus(task.taskId, 'Open');
                                                    loadTask();
                                                } catch (e: any) {
                                                    alert(e.response?.data?.message || 'Failed to re-open');
                                                } finally { setUpdatingStatus(false); }
                                            }}
                                            disabled={updatingStatus}
                                            className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-200"
                                        >
                                            {updatingStatus ? 'Opening...' : 'Re-open Task'}
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={async () => {
                                            if (!window.confirm('Re-open this task?')) return;
                                            setUpdatingStatus(true);
                                            try {
                                                await issueService.updateTaskStatus(task.taskId, 'Open');
                                                loadTask();
                                            } catch (e: any) {
                                                alert(e.response?.data?.message || 'Failed to re-open');
                                            } finally { setUpdatingStatus(false); }
                                        }}
                                        disabled={updatingStatus}
                                        className="bg-slate-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-700"
                                    >
                                        Re-open Task
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Comments Section */}
                    <div>
                        <CommentsSection taskId={task.taskId} />
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="premium-card p-6">
                        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Details</h3>
                        <dl className="space-y-4">
                            <div>
                                <dt className="text-xs font-bold text-slate-400 uppercase">Assigned To</dt>
                                <dd className="mt-1">
                                    {currentUser?.roleName === 'Admin' ? (
                                        <select
                                            className="input-field py-1 text-sm"
                                            value={users.find(u => u.name === task.assignedToName)?.userId || ''}
                                            onChange={async (e) => {
                                                if (!e.target.value) return;
                                                setAssigning(true);
                                                try {
                                                    await issueService.assignTask(task.taskId, parseInt(e.target.value));
                                                    loadTask();
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
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-700">
                                                {task.assignedToName ? task.assignedToName.charAt(0) : 'U'}
                                            </div>
                                            <span className="font-bold text-slate-700 text-sm">{task.assignedToName || 'Unassigned'}</span>
                                        </div>
                                    )}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    <div className="premium-card p-0 overflow-hidden">
                        <button
                            onClick={() => setShowActivity(!showActivity)}
                            className="w-full flex justify-between items-center p-4 bg-slate-50 hover:bg-slate-100 transition-colors border-b border-slate-100"
                        >
                            <span className="text-sm font-extrabold text-slate-900 uppercase tracking-widest">Activity Log</span>
                            <svg className={`w-5 h-5 text-slate-400 transform transition-transform ${showActivity ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {showActivity && (
                            <div className="p-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                                <ActivityTimeline logs={logs} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
