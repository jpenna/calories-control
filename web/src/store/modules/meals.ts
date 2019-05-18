/* eslint-disable no-param-reassign */

import { MutationTree, Module, ActionTree, GetterTree } from 'vuex';
import Vue from 'vue';

import * as api from '@/api/meals';
import * as types from '../types';

import { RootInterface, Meals } from './@types';
import { ApiResponseError } from '@/api/apiBase';

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

function cleanDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Set the start and end time for the date
function prepareFetchTime(original: Date): { from: string, until: string } {
  const date = new Date(original);

  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  const from = date.toISOString();

  date.setHours(23);
  date.setMinutes(59);
  date.setSeconds(59);
  const until = date.toISOString();

  return { from, until };
}

const initialState: Meals.MealsState = {
  list: {},

  isFetching: new Set(),
  fetchingError: new Map(),

  isSubmitting: false,
  submitError: {},
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
    const dateString = cleanDate(filters.date);
    if (state.isFetching.has(dateString)) return;
    // Skip fetch if already have the data
    if (state.list[dateString] && !force) return;

    commit(types.FETCH_MEALS, dateString);

    const { from, until } = prepareFetchTime(filters.date);
    const apiFilters = { ...filters, from, until };

    api.listMeals(apiFilters)
      .then((data: api.ListMealsRes) => {
        commit(types.FETCH_MEALS_DONE, data);
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
    const mealDate = cleanDate(meal.eatenAt);
    const dateList = { ...state.list[mealDate], [meal.id]: meal };
    Vue.set(state.list, mealDate, dateList);
  },
  [types.NEW_MEAL_FAIL](state, error: ApiResponseError) {
    const { status, message, code } = error.apiError;

    state.isSubmitting = false;
    state.submitError = { status, message, code };
  },

  // Fetch Meals
  [types.FETCH_MEALS](state, date: string) {
    state.isFetching.add(date);
    state.fetchingError.set(date, {});
  },
  [types.FETCH_MEALS_DONE](state, payload: { data: api.ListMealsRes, date: string }) {
    const { date, data: res } = payload;
    state.isFetching.delete(date);
    const dateList = res.meals.reduce((acc: { [id: string]: Meals.MealInterface }, meal) => {
      const norm = mapMeal(meal);
      acc[norm.id] = norm;
      return acc;
    }, {});
    Vue.set(state.list, date, dateList);
  },
  [types.FETCH_MEALS_FAIL](state, payload: { error: ApiResponseError, date: string }) {
    const { status, message, code } = payload.error.apiError;
    state.isFetching.delete(payload.date);
    state.submitError = { status, message, code };
  },
};

export default {
  namespaced: true,
  state: initialState,
  mutations,
  actions,
};
