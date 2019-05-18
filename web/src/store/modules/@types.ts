// export interface User {
//   permissions: ['users_edit'?, 'meals_all'?],
//   dailyCalories: number,
//   name: string,
//   email: string,
//   id: string,
// }


export interface RootInterface {
  // in case something is included in the root state in the future
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

    isFetching: Set<string>;
    fetchingError: Map<string, ApiError>;

    isSubmitting: boolean;
    submitError: ApiError;
  }

  export interface FiltersInterface {
    userId?: string;
    date: Date;
    skip?: number;
    limit?: number;
  }
}
