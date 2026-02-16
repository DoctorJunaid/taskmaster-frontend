import axios from "axios";

export const AuthService = {
  resetPassword: async (token, newPassword) => {
    const response = await axios.patch(
      import.meta.env.VITE_API_URL + "/password",
      {
        token,
        password: newPassword,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      },
    );
    return response.data;
  },

  changePassword: async (username, newPassword) => {
    const response = await axios.patch(
      import.meta.env.VITE_API_URL + `/change-password`,
      {
        username,
        password: newPassword,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      },
    );

    return response.data;
  },
  logout: async () => {
    try {
      await axios.post(import.meta.env.VITE_API_URL + "/logout");
    } catch (e) {
      console.error(e);
    }
    window.location.href = "/login";
  },

  getSignatureForUpload: async () => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "sign-upload",
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  },

  updateImageProfile: async (username, file) => {
    try {
      //  Getting Signature 
      const { signature, timestamp, cloudName, apiKey } = await this.getSignatureForUpload();

      //   Uploading to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      formData.append("folder", "taskmaster_profile_images");

      const cloudinaryResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData,
      );
      const imageUrl = cloudinaryResponse.data.secure_url;

      // Updating user profile data in   MongoDB
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/${username}/upload-image`,
        { profileImageUrl: imageUrl },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );

      return response.data;
    } catch (error) {
      console.error("Upload process failed:", error.message);
      if (error.config?.url?.includes("cloudinary")) {
        throw new Error(
          "Cloudinary upload failed. Check your signature or file size.",
        );
      } else {
        throw new Error(
          "Backend update failed. The image is on Cloudinary, but not saved to your profile.",
        );
      }
    }
  },
};
