import { Injectable } from '@angular/core';
import { ToDo } from '@app/models/todo';
import { ToDosState } from '@app/store/store.reducers';
import { Store } from '@ngrx/store';
import * as storeActions from '@store/store.actions';

export abstract class ToDoFormService {
  abstract submit(formData: Partial<ToDo> | ToDo): void;
}

@Injectable()
export class NewToDoService extends ToDoFormService {
  constructor(private store: Store<ToDosState>) {
    super();
  }
  submit(formData: Partial<ToDo>) {
    this.store.dispatch(storeActions.toDoActions.addToDo({ toDo: formData }));
  }
}

@Injectable()
export class EditToDoService extends ToDoFormService {
  constructor(private store: Store<ToDosState>) {
    super();
  }
  submit(formData: ToDo) {
    this.store.dispatch(storeActions.toDoActions.updateToDo({ toDo: formData }));
  }
}
