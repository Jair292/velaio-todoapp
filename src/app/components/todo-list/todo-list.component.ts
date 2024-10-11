import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Person, ToDo } from 'src/app/models/todo';
import { LoaderComponent } from '../loader/loader.component';
import { ToDoFilterPipe } from 'src/app/pipes/todofilter.pipe';
import { ToDosService } from 'src/app/services/todos.service';
import { ButtonDirective } from 'src/app/directives/button.directive';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, finalize, startWith, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { PaginatorComponent } from '../paginator/paginator.component';

@Component({
  selector: "app-todo-list",
  standalone: true,
  imports: [
    CommonModule,
    LoaderComponent,
    ToDoFilterPipe,
    ButtonDirective,
    FormsModule,
    PaginatorComponent
  ],
  templateUrl: "./todo-list.component.html",
  styleUrls: ["./todo-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoListComponent implements OnDestroy {
  toDosService = inject(ToDosService);
  destroy$ = new Subject<void>();

  // Data Observable from Service
  todos$ = this.toDosService.todos$;
  totalPages$ = this.toDosService.totalPages$;

  // Loading state Observables
  updatingToDo$ = new BehaviorSubject<boolean>(false);
  loadingToDos$ = this.toDosService.loadingToDos$;
  filteringToDos$ = new BehaviorSubject<boolean>(false);

  // Request trigger Observables
  filterValue$ = new BehaviorSubject<ToDo["status"] | undefined>(undefined);
  page$ = new BehaviorSubject<number>(1);

  state$ = combineLatest([this.filterValue$, this.page$]).pipe(
    switchMap(([filterValue, page]) =>
      this.toDosService.requestToDos(filterValue, page).pipe(
        startWith(null),
        finalize(() => {
          this.filteringToDos$.next(false)
        })
      )
    ),
    takeUntil(this.destroy$),
  );

  ngOnInit() {
    this.state$.subscribe(() => this.filteringToDos$.next(true));
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  changePage(page: number) {
    this.page$.next(page);
  }

  getStatusForCheckbox(status: ToDo["status"]): boolean {
    return status == "open" ? false : true;
  }

  updateFilterValue(value: ToDo["status"] | undefined) {
    this.filterValue$.next(value);
    this.page$.next(1);
  }

  changeStatus(toDo: ToDo) {
    const status = toDo.status == "open" ? "closed" : "open";
    this.toDosService.updateToDo(toDo, { prop: "status", value: status }).pipe(
      tap(() => this.page$.next(this.page$.value)),
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
