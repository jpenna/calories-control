export const USERS_EDIT = 'users_edit';
export const MEALS_ALL = 'meals_all';

export const ROLES = {
  user: [],
  manager: [USERS_EDIT],
  admin: [USERS_EDIT, MEALS_ALL],
};
