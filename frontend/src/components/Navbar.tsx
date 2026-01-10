import React from 'react';
import { Link } from 'react-router-dom';

export const Navbar: React.FC = () => {
    return (
        <nav className="bg-gray-800 p-4 text-white">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">Issue Tracker</Link>
                <div className="space-x-4">
                    <Link to="/" className="hover:text-gray-300">Dashboard</Link>
                    <Link to="/new" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">New Issue</Link>
                </div>
            </div>
        </nav>
    );
};
