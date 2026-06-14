import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // Default FastAPI port

export const api = axios.create({
    baseURL: API_BASE_URL,
});

export const attendanceService = {
    registerStudent: async (studentId: string, file: File) => {
        const formData = new FormData();
        formData.append('student_id', studentId);
        formData.append('file', file);

        const response = await api.post('/register_student', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    predictAttendance: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/predict', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    getAttendanceLog: async () => {
        const response = await api.get('/attendance');
        return response.data;
    },

    getRegisteredStudents: async () => {
        const response = await api.get('/students');
        return response.data;
    }
};
