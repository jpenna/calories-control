/* eslint-disable no-param-reassign */

import { MutationTree, ActionTree, GetterTree } from 'vuex';
import Vue from 'vue';

import * as api from '@/api/meals';
import * as types from '../types';

import { RootInterface, Meals } from './@types';
import { ApiResponseError } from '@/api/apiBase';

import * as utils from '@/helpers/utils';

function mapMeal(meal: api.ApiMeal): Meals.MealInterface {
  return {
    id: meal.id,
    userId: meal.user,
    name: meal.name,
    notes: meal.notes,
    calories: meal.calories,
    eatenAt: new Date(meal.eatenAt),
  };
}

// Set the start and end time for the date
function prepareFetchTime(original: Date): { from: string, until: string } {
  const date = new Date(original);
  const from = utils.setFirstTime(date).toISOString();
  const until = utils.setLastTime(date).toISOString();
  return { from, until };
}

const initialState: Meals.MealsState = {
  list: {},

  isFetching: new Set(),
  fetchingError: new Map(),

  isSubmitting: false,
  submitError: {},
};

const getters: GetterTree<Meals.MealsState, RootInterface> = {
  getMealsForDate(state) {
    return (date: string | Date) => {
      const key = typeof date !== 'string' ? utils.getDateString(date) : date;
      return state.list[key] || {};
    };
  },
};

const actions: ActionTree<Meals.MealsState, RootInterface> = {
  // New Meal
  async newMeal({ commit }, meal: Meals.MealInterface) {
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

  // fetch meals
  async fetchMeals({ commit, state }, { filters, force }: { filters: Meals.FiltersInterface, force: boolean }) {
    const dateString = utils.getDateString(filters.date);
    if (state.isFetching.has(dateString)) return;
    // Skip fetch if already have the data
    if (state.list[dateString] && !force) return;

    commit(types.FETCH_MEALS, dateString);

    const { from, until } = prepareFetchTime(filters.date);
    const apiFilters = { ...filters, from, until };

    api.listMeals(apiFilters)
      .then((data: api.ListMealsRes) => {
        commit(types.FETCH_MEALS_DONE, { data, dateString });
      })
      .catch((error: ApiResponseError) => {
        commit(types.FETCH_MEALS_FAIL, error);
      });
  },
};

const mutations: MutationTree<Meals.MealsState> = {
  // New Meal
  [types.NEW_MEAL](state) {
    state.isSubmitting = true;
    state.submitError = {};
  },
  [types.NEW_MEAL_DONE](state, data: api.NewMealRes) {
    state.isSubmitting = false;
    const meal = mapMeal(data.meal);
    const mealDate = utils.getDateString(meal.eatenAt);
    const dateList = { ...state.list[mealDate], [meal.id]: meal };
    Vue.set(state.list, mealDate, dateList);
  },
  [types.NEW_MEAL_FAIL](state, error: ApiResponseError) {
    const { status, message, code } = error.apiError;

    state.isSubmitting = false;
    state.submitError = { status, message, code };
  },

  // Fetch Meals
  [types.FETCH_MEALS](state, dateString: string) {
    state.isFetching.add(dateString);
    state.fetchingError.set(dateString, {});
  },
  [types.FETCH_MEALS_DONE](state, payload: { data: api.ListMealsRes, dateString: string }) {
    const { dateString, data } = payload;
    state.isFetching.delete(dateString);
    const dateList = data.meals.reduce((acc: { [id: string]: Meals.MealInterface }, meal) => {
      const norm = mapMeal(meal);
      acc[norm.id] = norm;
      return acc;
    }, {});
    Vue.set(state.list, dateString, dateList);
  },
  [types.FETCH_MEALS_FAIL](state, payload: { error: ApiResponseError, dateString: string }) {
    const { status, message, code } = payload.error.apiError;
    state.isFetching.delete(payload.dateString);
    state.submitError = { status, message, code };
  },
};

export default {
  namespaced: true,
  state: initialState,
  mutations,
  getters,
  actions,
};
