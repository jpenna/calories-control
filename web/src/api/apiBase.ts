import axios from 'axios';

const axiosBase = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    Authorization: `Bearer ${localStorage.token}`,
  },
});

export default axiosBase;
