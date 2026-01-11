import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { issueService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { IssueDto, TaskDto } from '../types';

export const IssueDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [issue, setIssue] = useState<IssueDto | null>(null);
    const [tasks, setTasks] = useState<TaskDto[]>([]);
    const [newTask, setNewTask] = useState({ taskTitle: '', taskDescription: '', priorityId: 2 });
    const [loading, setLoading] = useState(true);
    const [updatingIssue, setUpdatingIssue] = useState(false);
    const [creatingTask, setCreatingTask] = useState(false);

    useEffect(() => {
        if (id) {
            loadIssue(parseInt(id));
            loadTasks(parseInt(id));
        }
    }, [id]);

    const loadTasks = async (issueId: number) => {
        try {
            const data = await issueService.getTasks(issueId);
            setTasks(data);
        } catch (err) {
            console.error('Failed to load tasks', err);
        }
    };

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!issue) return;
        setCreatingTask(true);
        try {
            await issueService.createTask({
                issueId: issue.issueId,
                taskTitle: newTask.taskTitle,
                taskDescription: newTask.taskDescription,
                priorityId: newTask.priorityId
            });
            setNewTask({ taskTitle: '', taskDescription: '', priorityId: 2 });
            loadTasks(issue.issueId);
        } catch (err) {
            alert('Failed to create task');
        } finally {
            setCreatingTask(false);
        }
    };

    const loadIssue = async (issueId: number) => {
        try {
            const data = await issueService.getById(issueId);
            console.log(`Loaded Issue ${issueId} with status: ${data.statusName}`);
            setIssue(data);
        } catch (err) {
            alert('Failed to load issue');
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = async () => {
        if (!issue) return;
        if (!window.confirm('Are you sure you want to close this issue? All tasks must be closed first.')) return;

        setUpdatingIssue(true);
        console.log(`Attempting to close issue ${issue.issueId}...`);
        try {
            await issueService.close(issue.issueId);
            console.log('Issue closed successfully, re-loading data...');
            loadIssue(issue.issueId);
            alert('Issue closed successfully!');
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Failed to close issue. Check if all tasks are closed.';
            console.error('Close Issue Error:', err.response?.data || err.message);
            alert(`ERROR: ${msg}`);
        } finally {
            setUpdatingIssue(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!issue) return <div>Issue not found</div>;

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-gray-500 text-sm">#{issue.issueId}</span>
                            <h1 className="text-3xl font-bold text-gray-900">{issue.issueTitle}</h1>
                        </div>
                        <div className="text-sm text-gray-500 mb-3">
                            Raised by: <span className="font-medium text-gray-900">{issue.createdByUserName}</span> from <span className="font-medium text-gray-900">{issue.createdByCompanyName}</span>
                        </div>
                        <div className="flex gap-2">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">{issue.issueType}</span>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${issue.statusName === 'Closed' ? 'bg-gray-100 text-gray-800' :
                                issue.statusName === 'Resolved' ? 'bg-orange-100 text-orange-800' :
                                    issue.statusName === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-green-100 text-green-800'
                                }`}>
                                {issue.statusName}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${issue.priorityName === 'High' ? 'bg-red-100 text-red-800' :
                                issue.priorityName === 'Medium' ? 'bg-orange-100 text-orange-800' :
                                    'bg-blue-100 text-blue-800'
                                }`}>
                                {issue.priorityName} Priority
                            </span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2 items-center">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Assigned:</span>
                            {issue.assignedToUsers && issue.assignedToUsers.length > 0 ? (
                                issue.assignedToUsers.map((u, i) => (
                                    <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100 font-medium capitalize">{u}</span>
                                ))
                            ) : (
                                <span className="text-xs text-gray-400 italic">No developers assigned yet</span>
                            )}
                        </div>
                    </div>
                    <div>
                        <div>
                            {issue.statusName !== 'Closed' && user?.roleName === 'Admin' && (
                                <button
                                    onClick={handleClose}
                                    disabled={updatingIssue}
                                    className={`${updatingIssue ? 'bg-red-300' : 'bg-red-600 hover:bg-red-700'} text-white px-4 py-2 rounded text-sm font-medium transition-colors`}
                                >
                                    {updatingIssue ? 'Closing...' : 'Close Issue'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="prose max-w-none border-t pt-4">
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="whitespace-pre-wrap text-gray-700">{issue.issueDescription}</p>
                </div>

                <div className="mt-8 border-t pt-4 bg-gray-50 -mx-6 px-6 pb-6">
                    <h3 className="text-lg font-semibold mb-4 pt-4">Tasks</h3>

                    <div className="space-y-4 mb-6">
                        {tasks.map(task => (
                            <div key={task.taskId} className="bg-white p-4 rounded shadow-sm border border-gray-200">
                                <div className="flex justify-between">
                                    <h4 className="font-medium text-gray-900">
                                        <Link to={`/tasks/${task.taskId}`} className="hover:text-blue-600 hover:underline">
                                            {task.taskTitle}
                                        </Link>
                                    </h4>
                                    <span className={`text-xs font-semibold px-2 py-1 rounded ${task.statusName === 'Closed' ? 'bg-gray-100 text-gray-800' :
                                        task.statusName === 'Resolved' ? 'bg-orange-100 text-orange-800' :
                                            task.statusName === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-green-100 text-green-800'
                                        }`}>{task.statusName}</span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{task.taskDescription}</p>
                                <div className="text-xs text-gray-500 mt-2">
                                    Assigned to: <span className="font-semibold text-blue-700">{task.assignedToName || 'Unassigned'}</span>
                                </div>
                            </div>
                        ))}
                        {tasks.length === 0 && <p className="text-gray-500 text-sm italic">No tasks created yet.</p>}
                    </div>

                    {user?.roleName === 'Admin' && (
                        <form onSubmit={handleCreateTask} className="bg-white p-4 rounded border border-gray-200">
                            <h4 className="text-sm font-semibold mb-3">Add New Task</h4>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    placeholder="Task Title"
                                    required
                                    className="w-full border rounded px-3 py-2 text-sm"
                                    value={newTask.taskTitle}
                                    onChange={e => setNewTask({ ...newTask, taskTitle: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <textarea
                                    placeholder="Task Description"
                                    className="w-full border rounded px-3 py-2 text-sm h-20"
                                    value={newTask.taskDescription}
                                    onChange={e => setNewTask({ ...newTask, taskDescription: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                <select
                                    className="w-full border rounded px-3 py-2 text-sm"
                                    value={newTask.priorityId}
                                    onChange={e => setNewTask({ ...newTask, priorityId: parseInt(e.target.value) })}
                                >
                                    <option value={1}>High</option>
                                    <option value={2}>Medium</option>
                                    <option value={3}>Low</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                disabled={creatingTask}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm font-medium"
                            >
                                {creatingTask ? 'Adding...' : 'Add Task'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
