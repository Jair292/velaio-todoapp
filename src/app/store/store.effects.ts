import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { RequestToDos, ResponseStatus, ToDosService } from "../services/todos.service";
import * as todoActions from "./store.actions";
import { catchError, EMPTY, map, switchMap, tap, withLatestFrom } from "rxjs";
import { Store } from "@ngrx/store";
import { AppState } from "./store.selectors";
import * as todoSelectors from "./store.selectors";

export const getToDos = createEffect(
  (actions$ = inject(Actions), toDoService = inject(ToDosService)) => {
    return actions$.pipe(
      ofType(todoActions.getToDos),
      switchMap((action) =>
        toDoService
          .requestToDos(action.status, action.page, action.pageSize)
          .pipe(
            map((requestResponse: RequestToDos) =>
              todoActions.getToDosSuccess({
                toDos: requestResponse.data,
                status: action.status,
                pagination: {
                  page: requestResponse.pagination.page,
                  pageSize: requestResponse.pagination.pageSize,
                  pagesCount: requestResponse.pagination.pagesCount
                }
              })
            ),
            catchError(() => EMPTY) // add error handle fn
          )
      )
    )
  },
  { functional: true }
);

export const changePage = createEffect(
  (
    actions$ = inject(Actions),
    toDoService = inject(ToDosService),
    store = inject(Store<AppState>)
  ) => {
    return actions$.pipe(
      ofType(todoActions.changePage),
      withLatestFrom(
        store.select(todoSelectors.selectFilters),
        store.select(todoSelectors.selectPageSize)
      ),
      switchMap(([action, filters, pageSize]) =>
        toDoService.requestToDos(filters.status, action.page, pageSize).pipe(
          map((requestResponse: RequestToDos) =>
            todoActions.getToDosSuccess({
              toDos: requestResponse.data,
              status: filters.status,
              pagination: {
                page: requestResponse.pagination.page,
                pageSize: requestResponse.pagination.pageSize,
                pagesCount: requestResponse.pagination.pagesCount,
              },
            })
          ),
          catchError(() => EMPTY) // add error handle fn
        )
      )
    )
  },
  { functional: true }
);

export const addTodo = createEffect(
  (actions$ = inject(Actions), toDoService = inject(ToDosService)) => {
    return actions$.pipe(
      ofType(todoActions.addToDo),
      switchMap((action) =>
        toDoService.addToDo(action.toDo).pipe(
          map((response: ResponseStatus) => todoActions.addToDoSuccess(response)),
          catchError(() => EMPTY) // add error handle fn
        )
      )
    )
  },
  { functional: true }
);

export const updateToDo = createEffect(
  (actions$ = inject(Actions), toDoService = inject(ToDosService)) => {
    return actions$.pipe(
      ofType(todoActions.updateToDo),
      switchMap((action) =>
        toDoService.updateToDo(action.toDo).pipe(
          tap((response) => {
            console.log(response);
          }),
          map((response: ResponseStatus) => todoActions.updateToDoSuccess(response)),
          catchError(() => EMPTY) // add error handle fn
        )
      )
    )
  },
  { functional: true }
);
