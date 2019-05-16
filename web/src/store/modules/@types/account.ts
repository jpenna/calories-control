export interface User {
  userId: string;
}

export interface State {
  user: User;
  isAuthenticating: boolean;
}

export interface DoLoginActionArgs {
  email: string;
  password: string;
}
