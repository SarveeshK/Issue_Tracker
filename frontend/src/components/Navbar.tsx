import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-gray-900 border-b border-gray-800 p-4 text-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center gap-8">
                    <Link to="/" className="text-xl font-bold tracking-tight text-blue-500">
                        Work<span className="text-white">Hub</span><span className="text-gray-400 font-normal ml-1">-CES</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-6">
                        {user && <Link to="/" className="text-sm font-medium hover:text-blue-400 transition-colors">Dashboard</Link>}
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    {user && (
                        <div className="flex items-center gap-3 border-r border-gray-700 pr-6">
                            <div className="text-right">
                                <p className="text-sm font-bold text-white leading-none">{user.name}</p>
                                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mt-1 line-clamp-1">{user.roleName}</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm">
                                {user.name.charAt(0)}
                            </div>
                        </div>
                    )}
                    {user && (
                        <Link to="/new" className="bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-bold shadow-md transition-all active:scale-95">
                            New Issue
                        </Link>
                    )}
                    {user && (
                        <button
                            onClick={logout}
                            className="text-xs font-bold text-gray-500 hover:text-red-400 transition-colors"
                        >
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};
