import apiBase from './apiBase';

export interface NewMealRes {
  success: boolean,
  meal: {
      user: string;
      name: string;
      notes: string;
      calories: number;
      eatenAt: string;
      id: string;
  }
}
export interface NewMealParams {
  name: string;
  notes: string;
  calories: number;
  eatenAt: string;
  userId: string;
}
export function newMeal(params: NewMealParams): Promise<NewMealRes> {
  return apiBase
    .post('/meals/new', params)
    .then((res): NewMealRes => res.data);
}
