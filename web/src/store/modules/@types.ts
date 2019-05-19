export interface RootInterface {
  // in case something is included in the root state in the future
  [module: string]: any;
}

export interface ApiError {
  status?: number | null,
  message?: string,
  code?: number,
}

// Authentication
export namespace Auth {
  export interface AuthState {
    userId: string;
    isAuthenticating: boolean;
    isAuthenticated: boolean;
    authError: ApiError;
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
}

// Meals
export namespace Meals {
  export interface MealInterface {
    id: string;
    userId: string;
    name: string;
    notes: string;
    calories: number;
    eatenAt: Date;
  }

  export interface MealsState {
    list: {
      [date: string]: {
        [id: string]: MealInterface;
      },
    };

    listTotal: {
      [date: string]: number;
    };

    isFetching: { [date: string]: boolean };
    fetchingError: { [date: string]: ApiError };

    isSubmitting: boolean;
    submitError: ApiError;

    removingIds: string[];
  }

  export interface FiltersInterface {
    userId?: string;
    date: Date;
    timeRange?: [Date, Date];
    skip?: number;
    limit?: number;
  }
}

export namespace Users {
  export interface UserInterface {
    id: string;
    name: string;
    email: string;
    permissions: string[];
    dailyCalories: number;
  }
  export interface UsersState {
    usersList: { [id: string]: UserInterface };

    isFetchingUsers: boolean;
    usersError: ApiError;

    isUpdatingCalories: boolean;
    updateError: ApiError;
  }
}
