import { ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToDo } from 'src/app/models/todo';
import { LoaderComponent } from '../loader/loader.component';
import { FilterValueStatus, ToDosService } from 'src/app/services/todos.service';
import { ButtonDirective } from 'src/app/directives/button.directive';
import { FormsModule } from '@angular/forms';
import { PaginatorComponent } from '../paginator/paginator.component';
import { Store } from '@ngrx/store';
import * as storeActions from '../../store/store.actions';
import { selectForToDoList } from 'src/app/store/store.selectors';
import { ListLoadingMode, StatePagination, ToDosState } from 'src/app/store/store.reducers';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { Router } from '@angular/router';
import { trackByFn } from 'src/app/helpers/common';

@Component({
  selector: "app-todo-list",
  standalone: true,
  imports: [
    CommonModule,
    LoaderComponent,
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
  router = inject(Router);
  toDosService = inject(ToDosService);
  store = inject(Store<ToDosState>);
  @ViewChild('list') list!: ElementRef;
  vmState$ = this.store.select(selectForToDoList);
  trackByFn = trackByFn;

  ngOnInit() {
    this.store.dispatch(storeActions.toDoListActions.getToDosPage({ page: 1 }));
  }

  ngOnDestroy() {
    // this.store.dispatch(storeActions.toDoListActions.resetList());
  }

  displayToDoIndex(i: number, page: number, mode: ListLoadingMode) {
    if (mode == 'infinite-scrolling') return i + 1;
    return i + 1 + (page - 1) * 10;
  }

  changePage(page: number) {
    this.store.dispatch(storeActions.toDoListActions.getToDosPage({ page }));
    this.list.nativeElement.scrollTo({
      behavior: "smooth",
      top: 0,
    })
  }

  getStatusForCheckbox(status: ToDo["status"]): boolean {
    return status == "open" ? false : true;
  }

  updateFilterValue(value: FilterValueStatus) {
    this.store.dispatch(storeActions.toDoListActions.getFilteredToDos({ filterValue: value, page: 1, reset: true }));
  }

  changeToDoStatus(toDo: ToDo) {
    const updatedToDo: ToDo = {
      ...toDo,
      status: toDo.status == "open" ? "closed" : "open",
    }
    this.store.dispatch(storeActions.toDoActions.updateToDo({ toDo: updatedToDo }));
  }

  editToDo(toDo: ToDo) {
    this.router.navigate(['todo-form', toDo.id]);
  }

  disableToDosContainer(viewState: ToDosState["viewState"]) {
    return viewState.updatingToDo || viewState.loadingToDos
  }

  changeLoadingMode(currentLoadingMode: ListLoadingMode) {
    const loadingMode = currentLoadingMode == 'pagination' ? 'infinite-scrolling' : 'pagination';
    this.store.dispatch(storeActions.toDoListActions.updateListLoadingMode({ listLoadingMode: loadingMode, reset: true }));
  }

  onScrollDown(config: StatePagination) {
    this.store.dispatch(storeActions.toDoListActions.getToDosPage({...config, page: config.page + 1}));
  }
}
