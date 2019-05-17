/* eslint-disable no-param-reassign */

import { MutationTree, Module, ActionTree, GetterTree } from 'vuex';

import * as api from '@/api/meals';
import * as types from '../types';

import { RootInterface, MealsState, MealInterface } from './@types';
import { ApiResponseError } from '@/api/apiBase';

function mapMeal(meal: api.ApiMeal): MealInterface {
  return {
    userId: meal.user,
    name: meal.name,
    notes: meal.notes,
    calories: meal.calories,
    eatenAt: new Date(meal.eatenAt),
    id: meal.id,
  };
}

const initialState: MealsState = {
  list: {},

  isAdding: false,
  addError: {},
};

const actions: ActionTree<MealsState, RootInterface> = {
  async newMeal({ commit }, meal: MealInterface) {
    commit(types.NEW_MEAL);
    const apiMeal = { ...meal, eatenAt: meal.eatenAt.toISOString() };
    api.newMeal(apiMeal)
      .then((data: api.NewMealRes) => {
        commit(types.NEW_MEAL_DONE, data);
      })
      .catch((error: ApiResponseError) => {
        commit(types.NEW_MEAL_FAIL, error);
      });
  },
};

const mutations: MutationTree<MealsState> = {
  // New Meal
  [types.NEW_MEAL](state) {
    state.isAdding = true;
    state.addError = {};
  },
  [types.NEW_MEAL_DONE](state, data: api.NewMealRes) {
    state.isAdding = false;
    const meal = mapMeal(data.meal);
    state.list = { ...state.list, [meal.id]: meal };
  },
  [types.NEW_MEAL_FAIL](state, error: ApiResponseError) {
    const { status, message, code } = error.apiError;

    state.isAdding = false;
    state.addError = { status, message, code };
  },
};

export default {
  namespaced: true,
  state: initialState,
  mutations,
  actions,
};
