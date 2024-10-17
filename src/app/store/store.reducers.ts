import { createReducer, on } from "@ngrx/store";
import { ToDo } from "../models/todo";
import * as toDoActions from "./store.actions";
import { FilterValueStatus } from "../services/todos.service";

export interface ToDosState {
  data: {
    toDos: ToDo[];
  },
  filters: {
    status: FilterValueStatus
  }
  viewState: {
    loadingToDos: boolean;
    updatingToDo: boolean;
    filteringToDos: boolean;
  },
  pagination: {
    page: number;
    pageSize: number;
    pagesCount: number;
  }
}

export const initialState: ToDosState = {
  data: {
    toDos: [],
  },
  filters: {
    status: 'all',
  },
  viewState: {
    loadingToDos: true,
    updatingToDo: false,
    filteringToDos: false,
  },
  pagination: {
    page: 1,
    pageSize: 10,
    pagesCount: 1
  }
}

export const todosReducer = createReducer(
  initialState,
  on(toDoActions.getToDos, (state) => {
    return {
      ...state,
      viewState: {
        ...state.viewState,
        loadingToDos: true
      }
    }
  }),
  on(toDoActions.getToDosSuccess, (state, { toDos, status, pagination }) => {
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
        loadingToDos: false
      },
      pagination: {
        ...state.pagination,
        ...pagination
      }
    }
  }),
  on(toDoActions.addToDo, (state, { toDo }) => {
    return {
      ...state
    }
  }),
  on(toDoActions.addToDoSuccess, (state, { status }) => {
    return {
      ...state
    }
  }),
  on(toDoActions.updateToDo, (state, { toDo }) => {
    return {
      ...state,
      viewState: {
        ...state.viewState,
        updatingToDo: true
      }
    }
  }),
  on(toDoActions.updateToDoSuccess, (state, { status }) => {
    return {
      ...state,
      viewState: {
        ...state.viewState,
        updatingToDo: false
      }
    }
  }),
  // on(storeActions.deleteTodoSuccess, (state, { id }) => {
  //   return {
  //     ...state,
  //     data: {
  //       ...state.data,
  //       todos: state.data.todos.filter(todo => todo.id !== id)
  //     }
  //   }
  // }),

  on(toDoActions.changePage, (state, { page }) => {
    return {
      ...state,
      pagination: {
        ...state.pagination,
        page
      }
    }
  })
)
