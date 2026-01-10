import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { issueService } from '../services/api';
import type { IssueDto, TaskDto } from '../types';

export const IssueDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [issue, setIssue] = useState<IssueDto | null>(null);
    const [tasks, setTasks] = useState<TaskDto[]>([]);
    const [newTask, setNewTask] = useState({ taskTitle: '', taskDescription: '' });
    const [loading, setLoading] = useState(true);
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
                taskDescription: newTask.taskDescription
            });
            setNewTask({ taskTitle: '', taskDescription: '' });
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
            setIssue(data);
        } catch (err) {
            alert('Failed to load issue');
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = async () => {
        if (!issue || !window.confirm('Are you sure you want to close this issue?')) return;
        try {
            await issueService.close(issue.issueId);
            loadIssue(issue.issueId); // Refresh
        } catch (err) {
            alert('Failed to close issue');
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
                        <div className="flex gap-2">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">{issue.issueType}</span>
                            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-semibold">{issue.statusName}</span>
                        </div>
                    </div>
                    <div>
                        {issue.statusName !== 'Closed' && (
                            <button
                                onClick={handleClose}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium"
                            >
                                Close Issue
                            </button>
                        )}
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
                                    <span className="text-xs font-semibold px-2 py-1 bg-gray-100 rounded">{task.statusName}</span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{task.taskDescription}</p>
                                <div className="text-xs text-gray-500 mt-2">
                                    Assigned to: {task.assignedToName || 'Unassigned'}
                                </div>
                            </div>
                        ))}
                        {tasks.length === 0 && <p className="text-gray-500 text-sm italic">No tasks created yet.</p>}
                    </div>

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
                        <button
                            type="submit"
                            disabled={creatingTask}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm font-medium"
                        >
                            {creatingTask ? 'Adding...' : 'Add Task'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
