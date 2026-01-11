import React from 'react';
import { format } from 'date-fns';

interface AuditLog {
    logId: number;
    entityType: string;
    entityId: number;
    action: string;
    detail: string;
    timestamp: string;
    user?: {
        name: string;
    };
}

interface ActivityTimelineProps {
    logs: AuditLog[];
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ logs }) => {
    if (logs.length === 0) {
        return (
            <div className="py-8 text-center text-slate-400 text-sm italic font-medium">
                No activity recorded yet.
            </div>
        );
    }

    const getActionIcon = (action: string) => {
        switch (action.toLowerCase()) {
            case 'created':
                return (
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center border-2 border-white shadow-sm">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                );
            case 'statusupdated':
            case 'closed':
                return (
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center border-2 border-white shadow-sm">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                );
            case 'assigned':
                return (
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center border-2 border-white shadow-sm">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                );
            case 'deleted':
                return (
                    <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center border-2 border-white shadow-sm">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </div>
                );
            default:
                return (
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center border-2 border-white shadow-sm">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                );
        }
    };

    return (
        <div className="flow-root">
            <ul className="-mb-8">
                {logs.map((log, idx) => (
                    <li key={log.logId}>
                        <div className="relative pb-8">
                            {idx !== logs.length - 1 ? (
                                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-100" aria-hidden="true" />
                            ) : null}
                            <div className="relative flex space-x-4 items-start">
                                <div>{getActionIcon(log.action)}</div>
                                <div className="flex-1 min-w-0 pt-0.5">
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest flex justify-between">
                                        <span>{log.action}</span>
                                        <span className="font-medium normal-case tracking-normal text-slate-300">
                                            {format(new Date(log.timestamp), 'MMM d, h:mm a')}
                                        </span>
                                    </div>
                                    <div className="mt-1">
                                        <p className="text-sm text-slate-700 font-medium">
                                            {log.detail}
                                        </p>
                                    </div>
                                    {log.user && (
                                        <div className="mt-2 flex items-center gap-1.5">
                                            <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-[8px] font-extrabold text-slate-500 border border-slate-200 uppercase">
                                                {log.user.name.charAt(0)}
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                                                By {log.user.name}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};
