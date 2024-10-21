import { Routes } from "@angular/router";

export const routes: Routes = [
    {
      path: "todo-list",
      pathMatch: "full",
      loadComponent: () =>
        import("./components/todo-list/todo-list.component").then(
          (c) => c.TodoListComponent
        ),
    },
    {
      path: "add-todo",
      pathMatch: "full",
      loadComponent: () =>
        import("./components/todo-form/todo-form.component").then(
          (c) => c.TodoFormComponent
        ),
    },
    { path: "**", redirectTo: "todo-list" },
  ];
