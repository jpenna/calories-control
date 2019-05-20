import apiBase from './apiBase';

export interface ApiMeal {
  id: string;
  user: string;
  name: string;
  notes: string;
  calories: number;
  eatenAt: string;
}

export interface SubmitMealRes {
  success: boolean;
  meal: ApiMeal;
}
interface SubmitMealParams {
  id?: string;
  name: string;
  notes: string;
  calories: number;
  eatenAt: string;
  userId: string;
}
export function newMeal(params: SubmitMealParams): Promise<SubmitMealRes> {
  return apiBase
    .post('/meals/new', params)
    .then((res): SubmitMealRes => res.data);
}
export function updateMeal(params: SubmitMealParams): Promise<SubmitMealRes> {
  return apiBase
    .put(`/meals/${params.id}`, params)
    .then((res): SubmitMealRes => res.data);
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
  count: number;
  skipped: number;
}
export function listMeals(params: ListMealsParams): Promise<ListMealsRes> {
  return apiBase
    .get('/meals/list', {
      params,
    })
    .then((res): ListMealsRes => {
      return res.data;
    });
}

export interface DeleteMealRes {
  success: boolean;
  mealId: number;
}
export function deleteMeal(id: string): Promise<DeleteMealRes> {
  return apiBase
    .delete(`/meals/${id}`)
    .then((res): DeleteMealRes => res.data);
}
