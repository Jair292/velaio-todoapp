import { createReducer, on } from "@ngrx/store";
import { ToDo } from "../models/todo";
import * as storeActions from "./store.actions";
import { FilterValueStatus } from "../services/todos.service";

export type ListLoadingMode = 'infinite-scrolling' | 'pagination';

export type StatePagination = {
  page: number;
  pageSize: number;
  pagesCount: number;
}

const buildToDos = (currentToDos: ToDo[], newToDos: ToDo[], config: { mode: ListLoadingMode, reset: boolean }) => {
  if (config.mode == 'infinite-scrolling' && config.reset == false) {
      return [...currentToDos, ...newToDos];
  }
  return newToDos;
}

export interface ToDosState {
  data: {
    toDos: ToDo[];
    skills: string[];
  },
  filters: {
    status: FilterValueStatus
  },
  viewState: {
    loadingToDos: boolean;
    updatingToDo: boolean;
    filteringToDos: boolean;
    changinPageToDos: boolean;
    listLoadingMode: ListLoadingMode;
  },
  pagination: StatePagination,
  errors: {
    [key: string]: unknown;
  }
}

const paginationInitialState: StatePagination = {
  page: 1,
  pageSize: 10,
  pagesCount: 1
}

export const initialState: ToDosState = {
  data: {
    toDos: [],
    skills: []
  },
  filters: {
    status: 'all',
  },
  viewState: {
    loadingToDos: true,
    updatingToDo: false,
    filteringToDos: false,
    changinPageToDos: false,
    listLoadingMode: 'pagination'
  },
  pagination: paginationInitialState,
  errors: {}
}

export const todosReducer = createReducer(
  initialState,
  on(storeActions.listActions.getToDosPage, (state) => {
    return {
      ...state,
      viewState: {
        ...state.viewState,
        changinPageToDos: true
      }
    }
  }),
  on(storeActions.listActions.getFilteredToDos, (state) => {
    return {
      ...state,
      viewState: {
        ...state.viewState,
        filteringToDos: true
      }
    }
  }),
  on(storeActions.listActions.getToDosSuccess, (state, { toDos, status, pagination, reset }) => {
    return {
      ...state,
      data: {
        ...state.data,
        toDos: buildToDos(state.data.toDos, toDos, { mode: state.viewState.listLoadingMode, reset })
      },
      filters: {
        ...state.filters,
        status
      },
      viewState: {
        ...state.viewState,
        loadingToDos: false,
        filteringToDos: false,
        changinPageToDos: false
      },
      pagination: {
        ...state.pagination,
        ...pagination
      }
    }
  }),
  on(storeActions.toDosActions.updateToDo, (state, { toDo }) => {
    return {
      ...state,
      viewState: {
        ...state.viewState,
        updatingToDo: true
      }
    }
  }),
  on(storeActions.toDosActions.updateToDoSuccess, (state, { status }) => {
    return {
      ...state,
      viewState: {
        ...state.viewState,
        updatingToDo: false
      }
    }
  }),
  on(storeActions.listActions.getToDosPage, (state, { page }) => {
    return {
      ...state,
      pagination: {
        ...state.pagination,
        page
      }
    }
  }),
  on(storeActions.skillsActions.getSkillsSuccess, (state, { skills }) => {
    return {
      ...state,
      data: {
        ...state.data,
        skills
      }
    }
  }),
  on(storeActions.listActions.updateListLoadingMode, (state, { listLoadingMode }) => {
    return {
      ...state,
      pagination: paginationInitialState,
      viewState: {
        ...state.viewState,
        filteringToDos: true,
        listLoadingMode
      }
    }
  })
)
