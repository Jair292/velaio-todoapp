import { Routes } from "@angular/router";

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
    path: "todo-form/:todoId",
    pathMatch: "full",
    loadComponent: () =>
      import("./components/todo-form/todo-form.component").then(
        (c) => c.TodoFormComponent
      ),
  },
  {
    path: "todo-form",
    pathMatch: "full",
    loadComponent: () =>
      import("./components/todo-form/todo-form.component").then(
        (c) => c.TodoFormComponent
      ),
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
    // loadComponent: () => import("./components/not-found/not-found.component").then((c) => c.NotFoundComponent),
  },
];
