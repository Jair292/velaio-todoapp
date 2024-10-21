import { ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Person, ToDo } from 'src/app/models/todo';
import { LoaderComponent } from '../loader/loader.component';
import { ToDoFilterPipe } from 'src/app/pipes/todofilter.pipe';
import { FilterValueStatus, ToDosService } from 'src/app/services/todos.service';
import { ButtonDirective } from 'src/app/directives/button.directive';
import { FormsModule } from '@angular/forms';
import { PaginatorComponent } from '../paginator/paginator.component';
import { Store } from '@ngrx/store';
import * as storeActions from '../../store/store.actions';
import { selectForToDoList } from 'src/app/store/store.selectors';
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
  @ViewChild('list') list!: ElementRef;

  toDosService = inject(ToDosService);
  store = inject(Store<ToDosState>);
  vmState$ = this.store.select(selectForToDoList);

  ngOnInit() {
    this.store.dispatch(storeActions.listActions.getToDosPage({ page: 1 }));
  }

  displayToDoIndex(i: number, page: number, mode: ListLoadingMode) {
    if (mode == 'infinite-scrolling') return i + 1;
    return i + 1 + (page - 1) * 10;
  }

  changePage(page: number) {
    this.store.dispatch(storeActions.listActions.getToDosPage({ page }));
    this.list.nativeElement.scrollTo({
      behavior: "smooth",
      top: 0,
    })
  }

  getStatusForCheckbox(status: ToDo["status"]): boolean {
    return status == "open" ? false : true;
  }

  updateFilterValue(value: FilterValueStatus) {
    this.store.dispatch(storeActions.listActions.getFilteredToDos({ filterValue: value, page: 1, reset: true }));
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
    this.store.dispatch(storeActions.listActions.updateListLoadingMode({ listLoadingMode: loadingMode, reset: true }));
  }

  onScrollDown(config: StatePagination) {
    this.store.dispatch(storeActions.listActions.getToDosPage({...config, page: config.page + 1}));
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
