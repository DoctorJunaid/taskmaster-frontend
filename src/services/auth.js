import axios from 'axios';

export const AuthService = {

    resetPassword: async (token, newPassword) => {
        const response = await axios.patch(
            import.meta.env.VITE_API_URL + '/password',
            {
                token,
                password: newPassword
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            }
        );
        return response.data;
    },

    changePassword: async (username, newPassword) => {
        const response = await axios.patch(
            import.meta.env.VITE_API_URL + `/change-password`,
            {
                username,
                password: newPassword
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            }
        );

        return response.data;

    },
    logout: async () => {
        try {
            await axios.post(import.meta.env.VITE_API_URL + '/logout');
        } catch (e) { console.error(e); }
        window.location.href = '/login';
  },
  uploadImageProfile: async (username, file) => {
    const formData = new FormData();
    formData.append('profileImage', file);
    const response = await axios.patch(
          `${import.meta.env.VITE_API_URL}/${username}/upload-image`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );
        return response.data;
  }
};