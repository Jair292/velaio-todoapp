import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { RequestToDos, ResponseStatus, ToDosService } from "../services/todos.service";
import * as storeActions from "./store.actions";
import { catchError, EMPTY, exhaustMap, map, switchMap, withLatestFrom } from "rxjs";
import { Store } from "@ngrx/store";
import { AppState } from "./store.selectors";
import * as todoSelectors from "./store.selectors";
import { SkillsService } from "../services/skills.service";

export const getToDos = createEffect(
  (actions$ = inject(Actions), toDoService = inject(ToDosService), store = inject(Store<AppState>)) => {
    return actions$.pipe(
      ofType(
        storeActions.listActions.getToDosPage,
        storeActions.listActions.getFilteredToDos,
        storeActions.listActions.updateListLoadingMode
      ),
      withLatestFrom(
        store.select(todoSelectors.selectFilters),
        store.select(todoSelectors.selectPage),
        store.select(todoSelectors.selectPageSize)
      ),
      exhaustMap(([action, filters, page, pageSize]) => {
        const f = "filterValue" in action ? action.filterValue : filters.status;
        const pS = "pageSize" in action ? action.pageSize : pageSize;
        const p = "page" in action ? action.page : page;
        const reset = "reset" in action ? true : false;
        return toDoService.requestToDos(f, p, pS).pipe(
          map((requestResponse: RequestToDos) =>
            storeActions.listActions.getToDosSuccess({
              toDos: requestResponse.data,
              status: f,
              reset,
              pagination: {
                page: requestResponse.pagination.page,
                pageSize: requestResponse.pagination.pageSize,
                pagesCount: requestResponse.pagination.pagesCount,
              },
            })
          ),
          catchError(() => EMPTY ) // TODO: add error handle fn
        );
      })
    );
  },
  { functional: true }
);

export const addTodo = createEffect(
  (actions$ = inject(Actions), toDoService = inject(ToDosService)) => {
    return actions$.pipe(
      ofType(storeActions.toDosActions.addToDo),
      exhaustMap((action) =>
        toDoService.addToDo(action.toDo).pipe(
          map((response: ResponseStatus) => storeActions.toDosActions.addToDoSuccess(response)),
          catchError(() => EMPTY) // TODO: add error handle fn
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
      exhaustMap((action) =>
        toDoService.updateToDo(action.toDo).pipe(
          map((response: ResponseStatus) => storeActions.toDosActions.updateToDoSuccess(response)),
          catchError(() => EMPTY) // TODO: add error handle fn
        )
      )
    )
  },
  { functional: true }
);

export const getSkills = createEffect(
  (actions$ = inject(Actions), skillsService = inject(SkillsService)) => {
    return actions$.pipe(
      ofType(storeActions.skillsActions.getSkills),
      exhaustMap(() =>
        skillsService.requestSkills().pipe(
          map((response: string[]) => storeActions.skillsActions.getSkillsSuccess({ skills: response })),
          catchError(() => EMPTY) // TODO: add error handle fn
        )
      )
    )
  },
  { functional: true }
);
