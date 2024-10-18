import { createReducer, on } from "@ngrx/store";
import { ToDo } from "../models/todo";
import * as storeActions from "./store.actions";
import { FilterValueStatus } from "../services/todos.service";

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
  },
  pagination: {
    page: number;
    pageSize: number;
    pagesCount: number;
  },
  errors: {
    [key: string]: unknown;
  }
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
    changinPageToDos: false
  },
  pagination: {
    page: 1,
    pageSize: 10,
    pagesCount: 1
  },
  errors: {}
}

export const todosReducer = createReducer(
  initialState,
  on(storeActions.toDosActions.getToDos, (state) => {
    return {
      ...state,
      viewState: {
        ...state.viewState,
        loadingToDos: true
      }
    }
  }),
  on(storeActions.listActions.changePage, (state) => {
    return {
      ...state,
      viewState: {
        ...state.viewState,
        changinPageToDos: true
      }
    }
  }),
  on(storeActions.listActions.filterToDos, (state) => {
    return {
      ...state,
      viewState: {
        ...state.viewState,
        filteringToDos: true
      }
    }
  }),
  on(storeActions.toDosActions.getToDosSuccess, (state, { toDos, status, pagination }) => {
    return {
      ...state,
      data: {
        ...state.data,
        toDos
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
  on(storeActions.listActions.changePage, (state, { page }) => {
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
  })
)
