import apiBase from './apiBase';

export interface UserRes {
  id: string;
  name: string;
  email: string;
  permissions: string[]
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

export interface UpdateUserParam {
  name?: string;
  email?: string;
  permissions?: string[];
  dailyCalories?: number;
}
export interface UpdateUserRes {
  success: boolean;
  user: UserRes;
}
export function updateUser(userId: string, update: UpdateUserParam): Promise<UpdateUserRes> {
  return apiBase
    .put(`/users/${userId}`, update)
    .then((res): UpdateUserRes => res.data);
}
