import apiBase from './apiBase';

export interface UserRes {
  id: string;
  name: string;
  email: string;
  permissions: ['users_edit'?, 'meals_all'?];
  dailyCalories: number;
}
export interface FetchUsersRes {
  success: boolean;
  users: UserRes[];
}
export function fetchUsersList(): Promise<FetchUsersRes> {
  return apiBase
    .get('/users/list')
    .then((res): FetchUsersRes => res.data);
}
