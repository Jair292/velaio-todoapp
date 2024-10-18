import { ChangeDetectionStrategy, Component, ElementRef, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Person, ToDo } from 'src/app/models/todo';
import { LoaderComponent } from '../loader/loader.component';
import { ToDoFilterPipe } from 'src/app/pipes/todofilter.pipe';
import { FilterValueStatus, ToDosService } from 'src/app/services/todos.service';
import { ButtonDirective } from 'src/app/directives/button.directive';
import { FormsModule } from '@angular/forms';
import { combineLatest, map, Subject } from 'rxjs';
import { PaginatorComponent } from '../paginator/paginator.component';
import { Store } from '@ngrx/store';
import * as storeActions from '../../store/store.actions';
import { selectFilters, selectPage, selectPagination, selectTodos, selectViewState } from 'src/app/store/store.selectors';
import { ToDosState } from 'src/app/store/store.reducers';

@Component({
  selector: "app-todo-list",
  standalone: true,
  imports: [
    CommonModule,
    LoaderComponent,
    ToDoFilterPipe,
    ButtonDirective,
    FormsModule,
    PaginatorComponent,
  ],
  templateUrl: "./todo-list.component.html",
  styleUrls: ["./todo-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoListComponent implements OnInit, OnDestroy {
  toDosService = inject(ToDosService);
  destroy$ = new Subject<void>();
  #er = inject(ElementRef);
  store = inject(Store<ToDosState>);
  todos$ = this.store.select(selectTodos);
  filters$ = this.store.select(selectFilters);
  pagination$ = this.store.select(selectPagination);
  page$ = this.store.select(selectPage);
  viewState$ = this.store.select(selectViewState);

  vmState$ = combineLatest([
    this.todos$,
    this.filters$,
    this.viewState$,
    this.pagination$,
  ]).pipe(
    map(
      ([
        todos,
        filters,
        viewState,
        pagination
      ]) => ({
        todos,
        filters,
        viewState,
        pagination
      })
    )
  );

  ngOnInit() {
    this.store.dispatch(storeActions.toDosActions.getToDos());
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  displayToDoIndex(i: number, page: number) {
    return i + 1 + (page - 1) * 10;
  }

  changePage(page: number) {
    this.store.dispatch(storeActions.listActions.changePage({ page }));
    this.#er.nativeElement.scrollIntoView({ behavior: "smooth" });
  }

  getStatusForCheckbox(status: ToDo["status"]): boolean {
    return status == "open" ? false : true;
  }

  updateFilterValue(value: FilterValueStatus) {
    this.store.dispatch(storeActions.listActions.filterToDos({ filterValue: value, page: 1 }));
  }

  changeStatus(toDo: ToDo) {
    const updatedToDo: ToDo = {
      ...toDo,
      status: toDo.status == "open" ? "closed" : "open",
    }
    this.store.dispatch(storeActions.toDosActions.updateToDo({ toDo: updatedToDo }));
  }

  disableToDosContainer(viewState: ToDosState["viewState"]) {
    return viewState.updatingToDo || viewState.filteringToDos || viewState.changinPageToDos
  }

  trackByFn(index: number, item: ToDo | Person | string): number | string {
    if (typeof item === "string") {
      return item;
    } else if ("id" in item) {
      return item.id;
    } else if ("name" in item) {
      return item.name;
    }

    return index;
  }
}
