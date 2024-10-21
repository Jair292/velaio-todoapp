import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { ToDo } from "../models/todo";
import { ListLoadingMode, ToDosState } from "./store.reducers";
import { FilterValueStatus } from "../services/todos.service";

type Pagination = ToDosState['pagination'];

export const toDosActions = createActionGroup({
  source: '[ToDo]',
  events: {
    'Add ToDo': props<{ toDo: Partial<ToDo> }>(),
    'Add ToDo Success': props<{ status: unknown }>(),
    'Add ToDo Failure': props<{ status: unknown }>(),
    'Update ToDo': props<{ toDo: ToDo }>(),
    'Update ToDo Success': props<{ status: unknown }>(),
    'Update ToDo Failure': props<{ status: unknown }>()
  }
});

export const listActions = createActionGroup({
  source: '[ToDo]',
  events: {
    'Get ToDos Page': props<{ page: number, pageSize?: number }>(),
    'Get ToDos Page Success': props<{ toDos: ToDo[], status: FilterValueStatus, pagination: Pagination, reset: boolean }>(),
    'Get Filtered ToDos': props<{ filterValue: FilterValueStatus, page: 1, pageSize?: number, reset?: boolean }>(), // TODO: merge into get todos page action
    'Update List Loading Mode': props<{ listLoadingMode:  ListLoadingMode, reset?: boolean }>(),
  }
});

export const skillsActions = createActionGroup({
  source: '[Skills]',
  events: {
    'Get Skills': emptyProps(),
    'Get Skills Success': props<{ skills: string[] }>()
  }
});
