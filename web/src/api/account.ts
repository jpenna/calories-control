import apiBase from './apiBase';

export interface UserRes {
  id: string;
  name: string;
  email: string;
  permissions: ['users_edit'?, 'meals_all'?];
  dailyCalories: number;
}
export interface FetchMeRes {
  success: boolean;
  user: UserRes;
}
export function fetchMe(): Promise<FetchMeRes> {
  return apiBase
    .get('/users/me')
    .then((res): FetchMeRes => res.data);
}
