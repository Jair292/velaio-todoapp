import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
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

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
