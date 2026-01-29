import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL; // Should be /api/users

export const TodoService = {

    getAll: async (username) => {
        const response = await axios.get(`${API_URL}/${username}/todo`, {
            withCredentials: true
        });

        return response.data;
    },

    create: async (username, taskData) => {
        const response = await axios.post(`${API_URL}/${username}/todo`, taskData, {
            withCredentials: true

        });
        console.log(response.data);
        return response.data;
    },

    toggleStatus: async (username, taskId, status) => {
        const response = await axios.patch(`${API_URL}/${username}/todo/${taskId}/status`, { status }, {
            withCredentials: true
        });
        return response.data;
    },

    delete: async (username, taskId) => {
        const response = await axios.delete(`${API_URL}/${username}/todo/${taskId}`, {
            withCredentials: true
        });
        return response.data;
    }
};