import apiBase from './apiBase';

export function logoutUser(): void {
  localStorage.removeItem('token');
  window.location.reload();
}

export function updateAuthHeader() {
  apiBase.defaults.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
}
