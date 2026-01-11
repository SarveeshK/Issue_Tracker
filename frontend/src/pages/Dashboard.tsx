import React, { useEffect, useState } from 'react';
import { issueService } from '../services/api';
import type { IssueDto } from '../types';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Dashboard: React.FC = () => {
    const { user: currentUser } = useAuth();
    const [issues, setIssues] = useState<IssueDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        search: '',
        status: '',
        priority: '',
        type: ''
    });

    useEffect(() => {
        const timer = setTimeout(() => { loadIssues(); }, 300);
        return () => clearTimeout(timer);
    }, [filters]);

    const loadIssues = async () => {
        setLoading(true);
        try {
            const data = await issueService.getAll(filters);
            setIssues(data);
        } catch (err) {
            setError('Failed to load issues. Ensure backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this issue? It will be hidden from the dashboard.')) return;
        try {
            await issueService.deleteIssue(id);
            loadIssues();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to delete issue');
        }
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
            case 'High': return 'bg-red-50 text-red-600 border-red-100';
            case 'Medium': return 'bg-orange-50 text-orange-600 border-orange-100';
            case 'Low': return 'bg-slate-50 text-slate-600 border-slate-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    if (error) return (
        <div className="flex flex-col items-center justify-center p-20">
            <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 text-center max-w-md shadow-sm">
                <p className="font-bold text-lg mb-2">Oops!</p>
                <p className="text-sm opacity-80">{error}</p>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto p-6 space-y-8">
            <div className="flex justify-between items-end border-b border-slate-200 pb-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Issues</h1>
                    <p className="text-slate-500 mt-2 font-medium">Track, manage and resolve project tickets</p>
                </div>
                {(currentUser?.roleName === 'Admin' || currentUser?.roleName === 'User') && (
                    <Link to="/new" className="btn-primary flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Issue
                    </Link>
                )}
            </div>

            {/* Filters Section */}
            <div className="premium-card p-6 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6 items-end">
                <div className="lg:col-span-1 min-w-[200px]">
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2.5 ml-1">Search Keywords</label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Find tickets..."
                            className="input-field pl-10"
                            value={filters.search}
                            onChange={e => setFilters({ ...filters, search: e.target.value })}
                        />
                        <svg className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2.5 ml-1">Current Status</label>
                    <select
                        className="input-field appearance-none cursor-pointer"
                        value={filters.status}
                        onChange={e => setFilters({ ...filters, status: e.target.value })}
                    >
                        <option value="">All Statuses</option>
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                    </select>
                </div>

                <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2.5 ml-1">Priority Level</label>
                    <select
                        className="input-field appearance-none cursor-pointer"
                        value={filters.priority}
                        onChange={e => setFilters({ ...filters, priority: e.target.value })}
                    >
                        <option value="">All Priorities</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>

                <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2.5 ml-1">Issue Type</label>
                    <select
                        className="input-field appearance-none cursor-pointer"
                        value={filters.type}
                        onChange={e => setFilters({ ...filters, type: e.target.value })}
                    >
                        <option value="">All Types</option>
                        <option value="Bug">Bug</option>
                        <option value="Feature">Feature</option>
                        <option value="Enhancement">Enhancement</option>
                    </select>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setFilters({ search: '', status: '', priority: '', type: '' })}
                        className="text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors py-2 px-1"
                    >
                        Reset Filters
                    </button>
                </div>
            </div>

            <div className="premium-card overflow-hidden">
                <div className="overflow-x-auto relative">
                    {loading && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-20">
                            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent shadow-sm"></div>
                        </div>
                    )}
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">ID</th>
                                <th className="px-6 py-4 text-left text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Description</th>
                                <th className="px-6 py-4 text-left text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-left text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Priority</th>
                                <th className="px-6 py-4 text-left text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Assigned</th>
                                <th className="px-6 py-4 text-left text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Reporter</th>
                                <th className="px-6 py-4 text-left text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {issues.map((issue) => (
                                <tr key={issue.issueId} className="group hover:bg-slate-50/80 transition-colors">
                                    <td className="px-6 py-5 whitespace-nowrap text-xs font-bold text-slate-400">#{issue.issueId}</td>
                                    <td className="px-6 py-5">
                                        <div className="max-w-[300px]">
                                            <p className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">{issue.issueTitle}</p>
                                            <p className="text-xs text-slate-400 font-medium mt-1 truncate">{issue.createdByCompanyName}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <span className={`badge border ${getStatusColor(issue.statusName)}`}>
                                            {issue.statusName}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <span className={`badge border ${getPriorityColor(issue.priorityName)}`}>
                                            {issue.priorityName}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <div className="flex flex-wrap gap-1.5 max-w-[180px]">
                                            {issue.assignedToUsers.length > 0 ? (
                                                issue.assignedToUsers.map((u, i) => (
                                                    <span key={i} className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 uppercase tracking-tighter">
                                                        {u.split(' ')[0]}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Unassigned</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center font-bold text-[10px] text-blue-600 border border-blue-100 shadow-sm">
                                                {issue.createdByUserName.charAt(0)}
                                            </div>
                                            <span className="text-xs font-bold text-slate-700">{issue.createdByUserName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <Link
                                                to={`/issues/${issue.issueId}`}
                                                className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline px-2 py-1 rounded transition-all"
                                            >
                                                View Details
                                            </Link>
                                            {currentUser?.roleName === 'Admin' && (
                                                <button
                                                    onClick={() => handleDelete(issue.issueId)}
                                                    className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-all active:scale-90"
                                                    title="Soft Delete"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {issues.length === 0 && !loading && (
                    <div className="p-20 text-center flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                        </div>
                        <p className="text-slate-400 font-bold text-sm tracking-tight italic">No issues found matches your filters.</p>
                        <button
                            onClick={() => setFilters({ search: '', status: '', priority: '', type: '' })}
                            className="text-blue-600 text-xs font-bold hover:underline"
                        >
                            Reset all filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
