import apiBase from './apiBase';

export interface ApiMeal {
  user: string;
  name: string;
  notes: string;
  calories: number;
  eatenAt: string;
  id: string;
}

export interface NewMealRes {
  success: boolean;
  meal: ApiMeal;
}
interface NewMealParams {
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

interface ListMealsParams {
  userId?: string;
  from: string;
  until: string;
  skip?: number;
  limit?: number;
}
export interface ListMealsRes {
  success: boolean;
  meals: ApiMeal[];
}
export function listMeals(params: ListMealsParams): Promise<ListMealsRes> {
  return apiBase
    .get('/meals/list', {
      params,
    })
    .then((res): ListMealsRes => res.data);
}
