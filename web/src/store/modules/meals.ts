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
function prepareFetchTime(original: Date): [string, string] {
  const date = new Date(original);
  const from = utils.setFirstTime(date).toISOString();
  const until = utils.setLastTime(date).toISOString();
  return [from, until];
}

const initialState: Meals.MealsState = {
  list: {},
  listTotal: {},

  isFetching: new Set(),
  fetchingError: new Map(),

  isSubmitting: false,
  submitError: {},
};

const getters: GetterTree<Meals.MealsState, RootInterface> = {
  getMealsForDate(state): {} {
    return (date: string | Date) => {
      const key = typeof date !== 'string' ? utils.getDayString(date) : date;
      return state.list[key] || {};
    };
  },

  getTotalMealsForDate(state) {
    return (date: string | Date): number => {
      const key = typeof date !== 'string' ? utils.getDayString(date) : date;
      return state.listTotal[key] || 0;
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
    const dayString = utils.getDayString(filters.date);
    if (state.isFetching.has(dayString)) return;
    // Skip fetch if already have the data
    if (state.list[dayString] && !force) return;

    commit(types.FETCH_MEALS, dayString);

    let from;
    let until;
    if (filters.timeRange) {
      from = filters.timeRange[0].toISOString();
      until = filters.timeRange[1].toISOString();
    } else {
      const [fromIso, untilIso] = prepareFetchTime(filters.date);
      from = fromIso;
      until = untilIso;
    }

    const apiFilters = {
      from,
      until,
      limit: filters.limit,
      skip: filters.skip,
    };

    api.listMeals(apiFilters)
      .then((data: api.ListMealsRes) => {
        commit(types.FETCH_MEALS_DONE, { data, dayString });
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
    const mealDate = utils.getDayString(meal.eatenAt);
    const dateList = { ...state.list[mealDate], [meal.id]: meal };
    Vue.set(state.list, mealDate, dateList);
    // Setting with Vue in case there was nothing fetched (offline mode)
    Vue.set(state.listTotal, mealDate, (state.listTotal[mealDate] || 0) + 1);
  },
  [types.NEW_MEAL_FAIL](state, error: ApiResponseError) {
    const { status, message, code } = error.apiError;

    state.isSubmitting = false;
    state.submitError = { status, message, code };
  },

  // Fetch Meals
  [types.FETCH_MEALS](state, dayString: string) {
    state.isFetching.add(dayString);
    state.fetchingError.set(dayString, {});
  },
  [types.FETCH_MEALS_DONE](state, payload: { data: api.ListMealsRes, dayString: string }) {
    const { dayString, data } = payload;
    state.isFetching.delete(dayString);

    if (!state.list[dayString]) Vue.set(state.list, dayString, {});

    data.meals.forEach((meal) => {
      const norm = mapMeal(meal);
      Vue.set(state.list[dayString], norm.id, norm);
    });

    Vue.set(state.listTotal, dayString, data.count);
  },
  [types.FETCH_MEALS_FAIL](state, payload: { error: ApiResponseError, dayString: string }) {
    const { status, message, code } = payload.error.apiError;
    state.isFetching.delete(payload.dayString);
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
