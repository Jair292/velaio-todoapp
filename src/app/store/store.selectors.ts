import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ToDosState } from "./store.reducers";

export interface AppState {
  appState: ToDosState
}

export const selectToDosState = createFeatureSelector<AppState['appState']>('appState');

// Data
export const selectData = createSelector(selectToDosState, (state: AppState['appState']) => {
  return state.data
});
export const selectToDos = createSelector(selectData, (state: AppState['appState']['data']) => {
  return state.toDos
});
export const selectSkills = createSelector(selectData, (state: AppState['appState']['data']) => {
  return state.skills
});

// Filters
export const selectFilters = createSelector(selectToDosState, (state: AppState['appState']) => {
  return state.filters
});

// View State
export const selectViewState = createSelector(selectToDosState, (state: AppState['appState']) => {
  return state.viewState
});
export const selectLoadingToDosInitial = createSelector(selectViewState, (state: AppState['appState']['viewState']) => {
  return state.loadingToDosInitial
});
export const selectLoadingToDos = createSelector(selectViewState, (state: AppState['appState']['viewState']) => {
  return state.loadingToDos
});
export const selectUpdatingToDo = createSelector(selectViewState, (state: AppState['appState']['viewState']) => {
  return state.updatingToDo
});

// Pagination
export const selectPagination = (state: AppState) => state.appState.pagination;
export const selectPage = (state: AppState) => state.appState.pagination.page;
export const selectPageSize = (state: AppState) => state.appState.pagination.pageSize;
export const selectPagesCount = (state: AppState) => state.appState.pagination.pagesCount;

// Errors
export const selectErrors = (state: AppState) => state.appState.errors;

// components selectors
export const selectForToDoList = createSelector(
  selectToDos,
  selectViewState,
  selectPagination,
  selectFilters,
  (toDos, viewState, pagination, filters) => {
    return {
      toDos,
      viewState,
      pagination,
      filters
    }
  }
)
