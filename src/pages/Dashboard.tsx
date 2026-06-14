import React, { useEffect, useState } from 'react';
import { AttendanceTable } from '../components/AttendanceTable';
import { attendanceService } from '../services/api';
import { Activity, Users, FileClock } from 'lucide-react';
import { toast } from 'sonner';

export const Dashboard = () => {
    const [logs, setLogs] = useState([]);
    const [students, setStudents] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [logsData, studentsData] = await Promise.all([
                    attendanceService.getAttendanceLog(),
                    attendanceService.getRegisteredStudents()
                ]);
                // Fast API returns an array for logs and students
                setLogs(logsData || []);
                setStudents(studentsData || []);
            } catch (error) {
                console.error("Dashboard fetch error:", error);
                toast.error('Failed to load dashboard data. Is the backend running?');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const totalClasses = logs.length;
    const recentAttendance = logs.length > 0 ? logs[logs.length - 1].present_students.length : 0;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">SmartPresence Dashboard</h1>
                <p className="text-gray-500">Monitor attendance and system metrics</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 font-medium">Registered Students</h3>
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <Users className="w-6 h-6 text-blue-500" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold">{isLoading ? '-' : students.length}</p>
                </div>

                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 font-medium">Total Sessions Recorded</h3>
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <Activity className="w-6 h-6 text-purple-500" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold">{isLoading ? '-' : totalClasses}</p>
                </div>

                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 font-medium">Last Session Attendance</h3>
                        <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <FileClock className="w-6 h-6 text-green-500" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold">{isLoading ? '-' : recentAttendance}</p>
                </div>
            </div>

            {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <AttendanceTable logs={logs} />
            )}
        </div>
    );
};
