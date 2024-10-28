import { ActivatedRoute } from "@angular/router";

export interface ToDoFormRouteParams {
  toDoId: string;
}

export const getToDoFormRouteParams = (route: ActivatedRoute): ToDoFormRouteParams | null => {
  const params = route.snapshot.params;
  if ('toDoId' in params && typeof params['toDoId'] === 'string') {
    return { toDoId: params['toDoId'] };
  }
  return null;
}
