import { createSelector, select } from "@ngrx/store";
import { ToDosState } from "./store.reducers";

export interface AppState {
  appState: ToDosState
}

// Data
export const selectTodos = (state: AppState) => state.appState.data.toDos;
export const selectSkills = (state: AppState) => state.appState.data.skills;

// Filters
export const selectFilters = (state: AppState) => state.appState.filters;

// View State
export const selectViewState = (state: AppState) => state.appState.viewState;
export const selectLoadingToDos = (state: AppState) => state.appState.viewState.loadingToDos;
export const selectUpdatingToDo = (state: AppState) => state.appState.viewState.updatingToDo;
export const selectFilteringToDos = (state: AppState) => state.appState.viewState.filteringToDos;

// Pagination
export const selectPagination = (state: AppState) => state.appState.pagination;
export const selectPage = (state: AppState) => state.appState.pagination.page;
export const selectPageSize = (state: AppState) => state.appState.pagination.pageSize;
export const selectPagesCount = (state: AppState) => state.appState.pagination.pagesCount;

// Errors
export const selectErrors = (state: AppState) => state.appState.errors;

// components selectors
export const selectForToDoList = createSelector(
  selectTodos,
  selectViewState,
  selectPagination,
  selectFilters,
  (todos, viewState, pagination, filters) => {
    return {
      todos,
      viewState,
      pagination,
      filters
    }
  }
)
