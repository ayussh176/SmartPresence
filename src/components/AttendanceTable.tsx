import React from 'react';
import { UserCheck, UserX } from 'lucide-react';

interface AttendanceLog {
    timestamp: string;
    present_students: string[];
    total_faces_detected: number;
}

interface AttendanceTableProps {
    logs: AttendanceLog[];
}

export const AttendanceTable: React.FC<AttendanceTableProps> = ({ logs }) => {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-green-500" />
                    Recent Attendance Logs
                </h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                    <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300">
                        <tr>
                            <th className="px-6 py-3 font-medium">Date & Time</th>
                            <th className="px-6 py-3 font-medium">Detected Faces</th>
                            <th className="px-6 py-3 font-medium">Recognized Students</th>
                            <th className="px-6 py-3 font-medium text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                    <UserX className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                                    No attendance records found.
                                </td>
                            </tr>
                        ) : (
                            logs.map((log, index) => (
                                <tr key={index} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                                        {new Date(log.timestamp).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center justify-center px-2.5 py-1 text-xs font-semibold text-blue-800 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 rounded-full">
                                            {log.total_faces_detected} Faces
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {log.present_students.length > 0 ? (
                                                log.present_students.map((student, idx) => (
                                                    <span key={idx} className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs px-2 py-1 rounded">
                                                        {student}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-red-500 text-xs font-medium">None Recognized</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {log.present_students.length === log.total_faces_detected && log.total_faces_detected > 0 ? (
                                            <span className="text-green-500 text-xs font-medium px-2 py-1 flex items-center justify-end gap-1">
                                                <UserCheck className="w-4 h-4" /> Perfect Match
                                            </span>
                                        ) : (
                                            <span className="text-amber-500 text-xs font-medium px-2 py-1 flex items-center justify-end gap-1">
                                                Review Needed
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
