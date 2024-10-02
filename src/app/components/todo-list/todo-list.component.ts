import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Person, ToDo } from 'src/app/models/todo';
import { LoaderComponent } from '../loader/loader.component';
import { ToDoFilterPipe } from 'src/app/pipes/todofilter.pipe';
import { ToDosService } from 'src/app/services/todos.service';
import { ButtonDirective } from 'src/app/directives/button.directive';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, map, Observable, switchMap, tap } from 'rxjs';

@Component({
  selector: "app-todo-list",
  standalone: true,
  imports: [
    CommonModule,
    LoaderComponent,
    ToDoFilterPipe,
    ButtonDirective,
    FormsModule,
  ],
  templateUrl: "./todo-list.component.html",
  styleUrls: ["./todo-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoListComponent {
  toDoService = inject(ToDosService);
  cd = inject(ChangeDetectorRef);

  filterValue$ = new BehaviorSubject<ToDo["status"] | undefined>(undefined);
  refreshTrigger$ = new BehaviorSubject<void>(undefined);

  todos$ = this.refreshTrigger$.pipe(
    switchMap(() => this.toDoService.requestToDos())
  );
  filteredTodos$ = combineLatest([this.todos$, this.filterValue$]).pipe(
    map(([todos, filterValue]) => this.filterData(todos, filterValue))
  );

  filterData(data: ToDo[], filterValue: ToDo["status"] | undefined) {
    console.log('filtering');
    return data.filter((todo) => {
      if (!filterValue) {
        return true;
      }
      return todo.status == filterValue;
    });
  }

  getStatus(status: ToDo["status"]): boolean {
    return status == "open" ? false : true;
  }

  updateFilterValue(value: ToDo["status"] | undefined) {
    this.filterValue$.next(value);
  }

  changeStatus(toDo: ToDo) {
    const status = toDo.status == "open" ? "closed" : "open";
    this.toDoService.updateToDo(toDo, { prop: "status", value: status }).pipe(
      tap(() => this.refreshTrigger$.next())
    ).subscribe();
  }

  trackByToDoFn(index: number, item: ToDo): number | string {
    return item.id;
  }

  trackByPersonFn(index: number, item: Person) {
    return item.name;
  }

  trackBySkillFn(index: number, item: string) {
    return item;
  }
}
