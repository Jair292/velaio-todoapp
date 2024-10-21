import { ChangeDetectionStrategy, Component, ElementRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Person, ToDo } from 'src/app/models/todo';
import { LoaderComponent } from '../loader/loader.component';
import { ToDoFilterPipe } from 'src/app/pipes/todofilter.pipe';
import { FilterValueStatus, ToDosService } from 'src/app/services/todos.service';
import { ButtonDirective } from 'src/app/directives/button.directive';
import { FormsModule } from '@angular/forms';
import { combineLatest, map } from 'rxjs';
import { PaginatorComponent } from '../paginator/paginator.component';
import { Store } from '@ngrx/store';
import * as storeActions from '../../store/store.actions';
import { selectFilters, selectPagination, selectTodos, selectViewState } from 'src/app/store/store.selectors';
import { ListLoadingMode, StatePagination, ToDosState } from 'src/app/store/store.reducers';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

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
    InfiniteScrollDirective
  ],
  templateUrl: "./todo-list.component.html",
  styleUrls: ["./todo-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoListComponent implements OnInit {
  toDosService = inject(ToDosService);
  #er = inject(ElementRef);
  store = inject(Store<ToDosState>);
  todos$ = this.store.select(selectTodos);
  filters$ = this.store.select(selectFilters);
  pagination$ = this.store.select(selectPagination);
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

  displayToDoIndex(i: number, page: number, mode: ListLoadingMode) {
    if (mode == 'infinite-scrolling') return i + 1;
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

  changeLoadingMode(currentLoadingMode: ListLoadingMode) {
    const loadingMode = currentLoadingMode == 'pagination' ? 'infinite-scrolling' : 'pagination';
    this.store.dispatch(storeActions.listActions.changeListLoadingMode({ listLoadingMode: loadingMode }));
  }

  onScrollDown(config: StatePagination) {
    this.store.dispatch(storeActions.listActions.changePage({...config, page: config.page + 1}));
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
