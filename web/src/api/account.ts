import apiBase from '@/api/apiBase';

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
