import apiBase from './apiBase';

export interface DoLoginResInterface {
  success: boolean;
  userId: string;
  token: string;
}
export function doLogin({ email, password }: { email: string, password: string }): Promise<DoLoginResInterface> {
  return apiBase
    .post('/login', {
      email,
      password,
    })
    .then((res): DoLoginResInterface => res.data);
}

export interface DoRegisterResInterface {
  success: boolean;
  userId: string;
  token: string;
}
export function doRegister({ name, email, password }: { name: string, email: string, password: string }): Promise<DoRegisterResInterface> {
  return apiBase
    .post('/register', { name, email, password })
    .then((res): DoRegisterResInterface => res.data);
}

export function logoutUser(): void {
  localStorage.removeItem('token');
  window.location.reload();
}

export function updateAuthHeader() {
  apiBase.defaults.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
}
