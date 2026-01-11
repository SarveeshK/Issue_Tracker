import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { issueService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ActivityTimeline } from '../components/ActivityTimeline';
import type { IssueDto, TaskDto } from '../types';

export const IssueDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [issue, setIssue] = useState<IssueDto | null>(null);
    const [tasks, setTasks] = useState<TaskDto[]>([]);
    const [logs, setLogs] = useState([]);
    const [newTask, setNewTask] = useState({ taskTitle: '', taskDescription: '', priorityId: 2 });
    const [loading, setLoading] = useState(true);
    const [updatingIssue, setUpdatingIssue] = useState(false);
    const [creatingTask, setCreatingTask] = useState(false);

    const isReadOnly = user?.roleName === 'User';
    const isAdmin = user?.roleName === 'Admin';

    useEffect(() => {
        if (id) {
            const issueId = parseInt(id);
            loadData(issueId);
        }
    }, [id]);

    const loadData = async (issueId: number) => {
        setLoading(true);
        try {
            const [issueData, tasksData, logsData] = await Promise.all([
                issueService.getById(issueId),
                issueService.getTasks(issueId),
                issueService.getIssueLogs(issueId)
            ]);
            setIssue(issueData);
            setTasks(tasksData);
            setLogs(logsData);
        } catch (err) {
            console.error('Failed to load issue data', err);
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!issue || isReadOnly) return;
        setCreatingTask(true);
        try {
            await issueService.createTask({
                issueId: issue.issueId,
                taskTitle: newTask.taskTitle,
                taskDescription: newTask.taskDescription,
                priorityId: newTask.priorityId
            });
            setNewTask({ taskTitle: '', taskDescription: '', priorityId: 2 });
            const [newTasks, newLogs] = await Promise.all([
                issueService.getTasks(issue.issueId),
                issueService.getIssueLogs(issue.issueId)
            ]);
            setTasks(newTasks);
            setLogs(newLogs);
        } catch (err) {
            alert('Failed to create task');
        } finally {
            setCreatingTask(false);
        }
    };

    const handleClose = async () => {
        if (!issue || isReadOnly) return;
        if (!window.confirm('Are you sure you want to close this issue? All tasks must be closed first.')) return;

        setUpdatingIssue(true);
        try {
            await issueService.close(issue.issueId);
            const [updatedIssue, newLogs] = await Promise.all([
                issueService.getById(issue.issueId),
                issueService.getIssueLogs(issue.issueId)
            ]);
            setIssue(updatedIssue);
            setLogs(newLogs);
            alert('Issue closed successfully!');
        } catch (err: any) {
            alert(`ERROR: ${err.response?.data?.message || 'Failed to close issue'}`);
        } finally {
            setUpdatingIssue(false);
        }
    };

    const handleDelete = async () => {
        if (!issue || !isAdmin) return;
        if (!window.confirm('Are you sure you want to delete this issue? This will hide it from the system.')) return;

        try {
            await issueService.deleteIssue(issue.issueId);
            navigate('/');
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to delete issue');
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center p-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent shadow-sm"></div>
        </div>
    );

    if (!issue) return (
        <div className="p-20 text-center font-bold text-slate-400">Issue not found</div>
    );

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <Link to="/" className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
                        <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-slate-400">ISSUE-#{issue.issueId}</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-xs font-bold text-slate-400">{issue.issueType.toUpperCase()}</span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{issue.issueTitle}</h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {isAdmin && issue.statusName !== 'Closed' && (
                        <button
                            onClick={handleClose}
                            disabled={updatingIssue}
                            className="btn-primary"
                        >
                            {updatingIssue ? 'Closing...' : 'Close Ticket'}
                        </button>
                    )}
                    {isAdmin && (
                        <button
                            onClick={handleDelete}
                            className="p-2.5 bg-white border border-red-100 text-red-500 rounded-lg hover:bg-red-50 transition-colors shadow-sm"
                            title="Soft Delete"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Description Section */}
                    <div className="premium-card p-6">
                        <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-50 pb-2">Description</h2>
                        <div className="prose prose-slate max-w-none">
                            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
                                {issue.issueDescription || "No description provided."}
                            </p>
                        </div>
                    </div>

                    {/* Tasks Section */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest border-l-4 border-blue-600 pl-3">Sub-Tasks ({tasks.length})</h2>
                        </div>

                        <div className="space-y-3">
                            {tasks.map(task => (
                                <Link
                                    to={`/tasks/${task.taskId}`}
                                    key={task.taskId}
                                    className="block premium-card p-5 group hover:border-blue-200"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{task.taskTitle}</h4>
                                            <p className="text-sm text-slate-400 mt-1 line-clamp-1">{task.taskDescription}</p>
                                        </div>
                                        <span className={`badge border text-[10px] ${task.statusName === 'Closed' ? 'bg-slate-50 text-slate-400 border-slate-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                            {task.statusName}
                                        </span>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center font-bold text-[8px] text-slate-400">
                                                {task.assignedToName?.charAt(0) || '?'}
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                                                {task.assignedToName || 'Unassigned'}
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-extrabold text-blue-500 uppercase tracking-widest group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                                            Manage <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        </span>
                                    </div>
                                </Link>
                            ))}
                            {tasks.length === 0 && (
                                <div className="p-10 text-center border-2 border-dashed border-slate-100 rounded-xl">
                                    <p className="text-slate-400 text-sm italic font-medium">No tasks associated with this issue.</p>
                                </div>
                            )}
                        </div>

                        {!isReadOnly && isAdmin && (
                            <form onSubmit={handleCreateTask} className="premium-card p-6 bg-slate-50/50 border-dashed">
                                <h3 className="text-sm font-extrabold text-slate-800 mb-4">Create New Task</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <input
                                            type="text"
                                            placeholder="Task headline..."
                                            required
                                            className="input-field"
                                            value={newTask.taskTitle}
                                            onChange={e => setNewTask({ ...newTask, taskTitle: e.target.value })}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <textarea
                                            placeholder="Detailed description of what needs to be done..."
                                            className="input-field h-24"
                                            value={newTask.taskDescription}
                                            onChange={e => setNewTask({ ...newTask, taskDescription: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Priority</label>
                                        <select
                                            className="input-field"
                                            value={newTask.priorityId}
                                            onChange={e => setNewTask({ ...newTask, priorityId: parseInt(e.target.value) })}
                                        >
                                            <option value={1}>High</option>
                                            <option value={2}>Medium</option>
                                            <option value={3}>Low</option>
                                        </select>
                                    </div>
                                    <div className="flex items-end">
                                        <button
                                            type="submit"
                                            disabled={creatingTask}
                                            className="btn-primary w-full"
                                        >
                                            {creatingTask ? 'Syncing...' : 'Add Task'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Details Card */}
                    <div className="premium-card p-6 space-y-6">
                        <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Ticket Metadata</h2>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-bold text-slate-400 text-[10px] uppercase tracking-wider">Status</span>
                                <span className={`badge border ${issue.statusName === 'Closed' ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                    {issue.statusName}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-bold text-slate-400 text-[10px] uppercase tracking-wider">Priority</span>
                                <span className={`badge border ${issue.priorityName === 'High' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                    {issue.priorityName}
                                </span>
                            </div>
                            <div className="pt-4 border-t border-slate-50 space-y-4">
                                <div>
                                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Reported By</label>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center font-bold text-xs text-indigo-600 border border-indigo-100">
                                            {issue.createdByUserName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-800">{issue.createdByUserName}</p>
                                            <p className="text-[10px] text-slate-400 font-medium">{issue.createdByCompanyName}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Activity Feed */}
                    <div className="premium-card p-6 h-fit max-h-[600px] flex flex-col">
                        <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-50 pb-2">Activity Stream</h2>
                        <div className="overflow-y-auto pr-2 custom-scrollbar">
                            <ActivityTimeline logs={logs} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
