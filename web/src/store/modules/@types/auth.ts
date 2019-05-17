// export interface User {
//   permissions: ['users_edit'?, 'meals_all'?],
//   dailyCalories: number,
//   name: string,
//   email: string,
//   id: string,
// }

export interface State {
  userId: string;
  isAuthenticating: boolean;
  isAuthenticated: boolean;
}

export interface DoLoginActionArgs {
  email: string;
  password: string;
}

export interface DoRegisterActionArgs {
  name: string;
  email: string;
  password: string;
  acceptTos: boolean;
}
