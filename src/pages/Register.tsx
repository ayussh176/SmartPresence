import React, { useState } from 'react';
import { UploadImage } from '../components/UploadImage';
import { attendanceService } from '../services/api';
import { toast } from 'sonner';
import { UserPlus } from 'lucide-react';

export const Register = () => {
    const [studentId, setStudentId] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!studentId.trim()) {
            toast.error('Please enter a student ID');
            return;
        }
        if (!selectedFile) {
            toast.error('Please select an image');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await attendanceService.registerStudent(studentId, selectedFile);
            toast.success(response.message || 'Student registered successfully');
            setStudentId('');
            setSelectedFile(null);
            // Reload page to clear preview state in UploadImage
            window.location.reload();
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.detail || 'Failed to register student');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="mb-8 select-none">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                    <UserPlus className="w-8 h-8 text-blue-500" />
                    Register Student
                </h1>
                <p className="text-gray-500">Add a new student face embedding to the database.</p>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 md:p-10 shadow-lg">
                <form onSubmit={handleRegister} className="space-y-8">

                    <div className="space-y-2">
                        <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Student ID / Roll Number
                        </label>
                        <input
                            type="text"
                            id="studentId"
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                            placeholder="e.g., student_101"
                            className="w-full md:w-1/2 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Clear Face Image
                        </label>
                        <p className="text-xs text-gray-500 mb-4">Ensure the image contains exactly one clear face, well-lit, and straight-facing.</p>
                        <UploadImage
                            onImageSelect={(file) => setSelectedFile(file)}
                        />
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-8 py-3 rounded-xl font-medium text-white shadow-md transition-all ${isSubmitting
                                    ? 'bg-blue-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg translate-y-[-1px]'
                                }`}
                        >
                            {isSubmitting ? 'Registering...' : 'Register Student'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
