import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { RequestToDos, ResponseStatus, ToDosService } from "../services/todos.service";
import * as storeActions from "./store.actions";
import { catchError, EMPTY, map, switchMap, tap, withLatestFrom } from "rxjs";
import { Store } from "@ngrx/store";
import { AppState } from "./store.selectors";
import * as todoSelectors from "./store.selectors";

export const getToDos = createEffect(
  (actions$ = inject(Actions), toDoService = inject(ToDosService), store = inject(Store<AppState>)) => {
    return actions$.pipe(
      ofType(storeActions.toDosActions.getToDos, storeActions.listActions.changePage, storeActions.listActions.filterToDos),
      withLatestFrom(
        store.select(todoSelectors.selectFilters),
        store.select(todoSelectors.selectPage),
        store.select(todoSelectors.selectPageSize)
      ),
      switchMap(([action, filters, page, pageSize]) => {
        const f = 'filterValue' in action ? action.filterValue : filters.status;
        const p = 'page' in action ?action.page : page;
        const pS = 'pageSize' in action ? action.pageSize : pageSize;
        return toDoService
          .requestToDos(f, p, pS)
          .pipe(
            map((requestResponse: RequestToDos) =>
              storeActions.toDosActions.getToDosSuccess({
                toDos: requestResponse.data,
                status: f,
                pagination: {
                  page: requestResponse.pagination.page,
                  pageSize: requestResponse.pagination.pageSize,
                  pagesCount: requestResponse.pagination.pagesCount
                }
              })
            ),
            catchError(() => EMPTY) // add error handle fn
          )
        }
      )
    )
  },
  { functional: true }
);

// export const changePage = createEffect(
//   (
//     actions$ = inject(Actions),
//     toDoService = inject(ToDosService),
//     store = inject(Store<AppState>)
//   ) => {
//     return actions$.pipe(
//       ofType(storeActions.listActions.changePage),
//       withLatestFrom(
//         store.select(todoSelectors.selectFilters),
//         store.select(todoSelectors.selectPageSize)
//       ),
//       switchMap(([action, filters, pageSize]) =>
//         toDoService.requestToDos(filters.status, action.page, pageSize).pipe(
//           map((requestResponse: RequestToDos) =>
//             storeActions.toDosActions.getToDosSuccess({
//               toDos: requestResponse.data,
//               status: filters.status,
//               pagination: {
//                 page: requestResponse.pagination.page,
//                 pageSize: requestResponse.pagination.pageSize,
//                 pagesCount: requestResponse.pagination.pagesCount,
//               },
//             })
//           ),
//           catchError(() => EMPTY) // add error handle fn
//         )
//       )
//     )
//   },
//   { functional: true }
// );

export const addTodo = createEffect(
  (actions$ = inject(Actions), toDoService = inject(ToDosService)) => {
    return actions$.pipe(
      ofType(storeActions.toDosActions.addToDo),
      switchMap((action) =>
        toDoService.addToDo(action.toDo).pipe(
          map((response: ResponseStatus) => storeActions.toDosActions.addToDoSuccess(response)),
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
      ofType(storeActions.toDosActions.updateToDo),
      switchMap((action) =>
        toDoService.updateToDo(action.toDo).pipe(
          map((response: ResponseStatus) => storeActions.toDosActions.updateToDoSuccess(response)),
          catchError(() => EMPTY) // add error handle fn
        )
      )
    )
  },
  { functional: true }
);
