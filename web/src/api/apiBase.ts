import axios from 'axios';

export function logoutUser(): void {
  localStorage.removeItem('token');
  window.location.reload();
}

const axiosBase = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    Authorization: `Bearer ${localStorage.token}`,
  },
});

export function updateAuthHeader() {
  axiosBase.defaults.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
}

export default axiosBase;
