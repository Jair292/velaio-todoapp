import { createAction, props } from "@ngrx/store";
import { ToDo } from "../models/todo";
import { ToDosState } from "./store.reducers";

type Pagination = ToDosState['pagination'];

export const getToDos = createAction(
  '[Todo] Get ToDos',
  props<{ status: ToDo['status'] | 'all', page: number, pageSize?: number }>()
)

export const getToDosSuccess = createAction(
  '[Todo] Get ToDos Success',
  props<{ toDos: ToDo[], status: ToDo['status'] | 'all', pagination: Pagination }>()
)

export const addToDo = createAction(
  '[Todo] Add Todo',
  props<{ toDo: Partial<ToDo> }>()
)

export const addToDoSuccess = createAction(
  '[Todo] Add Todo Success',
  props<{ status: unknown }>()
)

export const updateToDo = createAction(
  '[Todo] Update Todo',
  props<{ toDo: ToDo }>()
)

export const updateToDoSuccess = createAction(
  '[Todo] Update Todo Success',
  props<{ status: unknown }>()
)

// export const deleteTodo = createAction(
//   '[Todo] Delete Todo',
//   props<{ id: number }>()
// )

// export const deleteTodoSuccess = createAction(
//   '[Todo] Delete Todo',
//   props<{ id: number }>()
// )

export const changePage = createAction(
  '[Todo] Change Page',
  props<{ page: number, pageSize?: number }>()
)
