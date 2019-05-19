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

export interface DeleteUserRes {
  success: boolean;
  userId: number;
}
export function deleteUser(userId: string): Promise<DeleteUserRes> {
  return apiBase
    .delete(`/users/${userId}`)
    .then((res): DeleteUserRes => res.data);
}

export interface ChangePasswordRes {
  success: boolean;
}
export function changePassword(params: { password: string, newPassword: string }): Promise<ChangePasswordRes> {
  console.log(params)
  return apiBase
    .put('/users/change-password', params)
    .then((res): ChangePasswordRes => res.data);
}
