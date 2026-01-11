import React, { useEffect, useState } from 'react';
import { issueService } from '../services/api';
import type { IssueDto } from '../types';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Open': return 'bg-green-100 text-green-800';
            case 'In Progress': return 'bg-yellow-100 text-yellow-800';
            case 'Resolved': return 'bg-orange-100 text-orange-800';
            case 'Closed': return 'bg-gray-100 text-gray-800';
            default: return 'bg-blue-100 text-blue-800';
        }
    };

    if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-4">Issue Dashboard</h1>

            {/* Filters Section */}
            <div className="bg-white shadow rounded-lg p-6 mb-6 flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Search Issues</label>
                    <input
                        type="text"
                        placeholder="Title or description..."
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                        value={filters.search}
                        onChange={e => setFilters({ ...filters, search: e.target.value })}
                    />
                </div>

                <div className="w-[140px]">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Status</label>
                    <select
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                        value={filters.status}
                        onChange={e => setFilters({ ...filters, status: e.target.value })}
                    >
                        <option value="">All</option>
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                    </select>
                </div>

                <div className="w-[140px]">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Priority</label>
                    <select
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                        value={filters.priority}
                        onChange={e => setFilters({ ...filters, priority: e.target.value })}
                    >
                        <option value="">All</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>

                <div className="w-[140px]">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Type</label>
                    <select
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                        value={filters.type}
                        onChange={e => setFilters({ ...filters, type: e.target.value })}
                    >
                        <option value="">All</option>
                        <option value="Bug">Bug</option>
                        <option value="Feature">Feature</option>
                        <option value="Enhancement">Enhancement</option>
                    </select>
                </div>

                <button
                    onClick={() => setFilters({ search: '', status: '', priority: '', type: '' })}
                    className="text-sm text-gray-500 hover:text-blue-600 font-medium pb-2"
                >
                    Clear
                </button>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                {loading && (
                    <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                )}
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Raised By</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {issues.map((issue) => (
                            <tr key={issue.issueId} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{issue.issueId}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{issue.issueTitle}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(issue.statusName)}`}>
                                        {issue.statusName}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                                        {issue.assignedToUsers.length > 0 ? (
                                            issue.assignedToUsers.map((u, i) => (
                                                <span key={i} className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-100 font-medium capitalize">{u}</span>
                                            ))
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">None</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{issue.createdByUserName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{issue.createdByCompanyName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-900">
                                    <Link to={`/issues/${issue.issueId}`}>View</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {issues.length === 0 && !loading && (
                    <div className="p-8 text-center text-gray-500">No issues found. Create one!</div>
                )}
            </div>
        </div>
    );
};
