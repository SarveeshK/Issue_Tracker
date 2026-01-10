import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { issueService } from '../services/api';

export const NewIssue: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        issueTitle: '',
        issueDescription: '',
        issueType: 'Bug'
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await issueService.create(formData);
            navigate('/');
        } catch (err) {
            alert('Failed to create issue');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">Create New Issue</h1>
            <form onSubmit={handleSubmit} className="bg-white shadow rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
                    <input
                        type="text"
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={formData.issueTitle}
                        onChange={e => setFormData({ ...formData, issueTitle: e.target.value })}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                    <textarea
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                        value={formData.issueDescription}
                        onChange={e => setFormData({ ...formData, issueDescription: e.target.value })}
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Type</label>
                    <select
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={formData.issueType}
                        onChange={e => setFormData({ ...formData, issueType: e.target.value })}
                    >
                        <option value="Bug">Bug</option>
                        <option value="Feature">Feature</option>
                        <option value="Enhancement">Enhancement</option>
                    </select>
                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50' : ''}`}
                    >
                        {loading ? 'Creating...' : 'Create Issue'}
                    </button>
                </div>
            </form>
        </div>
    );
};
