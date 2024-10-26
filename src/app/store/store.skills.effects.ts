import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { exhaustMap, map, catchError, EMPTY } from "rxjs";
import { SkillsService } from "../services/skills.service";
import * as storeActions from "./store.actions";

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
