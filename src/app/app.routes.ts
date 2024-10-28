import { Routes } from "@angular/router";
import { SkillsService } from "./services/skills.service";
import { provideEffects } from "@ngrx/effects";
import * as skillsEffects from "./store/store.skills.effects";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "todo-list",
    pathMatch: "full",
  },
  {
    path: "todo-list",
    pathMatch: "full",
    loadComponent: () =>
      import("./components/todo-list/todo-list.component").then(
        (c) => c.TodoListComponent
      ),
  },
  {
    path: "todo-form",
    loadComponent: () =>
      import(
        "./components/forms/todo-form-controller/todo-form-controller.component"
      ).then((c) => c.TodoFormControllerComponent),
    children: [
      {
        path: "edit/:toDoId",
        pathMatch: "full",
        loadComponent: () =>
          import("./components/forms/todo-form/todo-form.component").then(
            (c) => c.TodoFormComponent
          ),
      },
      {
        path: "new",
        pathMatch: "full",
        loadComponent: () =>
          import("./components/forms/todo-form/todo-form.component").then(
            (c) => c.TodoFormComponent
          ),
      },
    ],
    providers: [SkillsService, provideEffects(skillsEffects)],
  },
  {
    path: "404",
    loadComponent: () =>
      import("./components/not-found/not-found.component").then(
        (c) => c.NotFoundComponent
      ),
    pathMatch: "full",
  },
  {
    path: "**",
    redirectTo: "404",
  },
];
