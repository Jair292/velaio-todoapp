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
    loadingToDosInitial: boolean
    loadingToDos: boolean;
    updatingToDo: boolean;
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
    loadingToDosInitial: true,
    updatingToDo: false,
    loadingToDos: false,
    listLoadingMode: 'pagination'
  },
  pagination: paginationInitialState,
  errors: {}
}

export const todosReducer = createReducer(
  initialState,
  on(storeActions.listActions.getToDosPage, (state, { page }) => {
    return {
      ...state,
      viewState: {
        ...state.viewState,
        loadingToDos: true
      },
      pagination: {
        ...state.pagination,
        page
      }
    }
  }),
  on(storeActions.listActions.getFilteredToDos, (state) => {
    return {
      ...state,
      viewState: {
        ...state.viewState,
        loadingToDos: true
      }
    }
  }),
  on(storeActions.listActions.getToDosPageSuccess, (state, { toDos, status, pagination, reset }) => {
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
        loadingToDosInitial: false
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
        loadingToDos: true,
        listLoadingMode
      }
    }
  })
)
