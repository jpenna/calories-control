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
export interface DoRegisterParams {
  name: string;
  email: string;
  password: string;
  acceptTos: boolean;
}
export function doRegister({ name, email, password, acceptTos }: DoRegisterParams): Promise<DoRegisterResInterface> {
  return apiBase
    .post('/register', { name, email, password, acceptTos })
    .then((res): DoRegisterResInterface => res.data);
}

export function logoutUser(): void {
  localStorage.removeItem('token');
  window.location.reload();
}

export function updateAuthHeader() {
  apiBase.defaults.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
}
