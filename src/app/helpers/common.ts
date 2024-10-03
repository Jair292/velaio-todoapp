import { InjectionToken } from "@angular/core";
import { TodoFormComponent } from "../components/todo-form/todo-form.component";

export const trackByFn = (index: number) => {
  return index;
}

export const FORM_TOKEN = new InjectionToken<TodoFormComponent>('FORM_TOKEN');
