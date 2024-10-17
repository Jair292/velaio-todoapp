import { ToDosState } from "./store.reducers";

export interface AppState {
  appState: ToDosState
}

// Data
export const selectTodos = (state: AppState) => state.appState.data.toDos;

// Filters
export const selectFilters = (state: AppState) => state.appState.filters;
// export const selectStatus = (state: AppState) => state.appState.filters.status;

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
