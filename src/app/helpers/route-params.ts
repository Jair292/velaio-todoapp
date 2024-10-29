import { ActivatedRoute } from "@angular/router";

export const ROUTE_PARAMS = {
  toDoId: "toDoId"
} as const;

export type ToDoFormRouteParams = Partial<typeof ROUTE_PARAMS>;

export const getToDoFormRouteParams = (route: ActivatedRoute): ToDoFormRouteParams | null => {
  const params = route.snapshot.params;
  if (ROUTE_PARAMS.toDoId in params && typeof params[ROUTE_PARAMS.toDoId] === 'string') {
    return { toDoId: params[ROUTE_PARAMS.toDoId] };
  }
  return null;
}
