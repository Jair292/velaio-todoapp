import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Person, ToDo } from 'src/app/models/todo';
import { LoaderComponent } from '../loader/loader.component';
import { ToDoFilterPipe } from 'src/app/pipes/todofilter.pipe';
import { ToDosService } from 'src/app/services/todos.service';
import { ButtonDirective } from 'src/app/directives/button.directive';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, finalize, startWith, Subject, switchMap, takeUntil, tap } from 'rxjs';

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
export class TodoListComponent implements OnInit, OnDestroy {
  toDoService = inject(ToDosService);
  cd = inject(ChangeDetectorRef);
  destroy$ = new Subject<void>();

  filterValue$ = new BehaviorSubject<ToDo["status"] | undefined>(undefined);
  updatingToDo$ = new BehaviorSubject<boolean>(false);
  todos$ = this.toDoService.todos$;
  loadingToDos$ = this.toDoService.loadingToDos$;
  filteringToDos$ = new BehaviorSubject<boolean>(false);

  ngOnInit() {
    this.filterValue$.pipe(
      switchMap(filterValue =>
        this.toDoService.requestToDos(filterValue).pipe(
          startWith(null),
          finalize(() => this.filteringToDos$.next(false))
        )
      ),
      takeUntil(this.destroy$),
    ).subscribe(() => this.filteringToDos$.next(true));
  }

  ngOnDestroy() {
    this.destroy$.next();
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
      tap(() => this.filterValue$.next(this.filterValue$.value)),
      finalize(() => this.updatingToDo$.next(false)),
    ).subscribe();

    this.updatingToDo$.next(true);
  }

  trackByFn(index: number, item: ToDo | Person | string): number | string {
    if (typeof item === 'string') {
      return item;
    } else if ('id' in item) {
      return item.id;
    } else if ('name' in item) {
      return item.name;
    }

    return index;
  }
}
