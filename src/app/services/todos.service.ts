import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ToDo } from '../models/todo';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodosService {

  #http = inject(HttpClient);
  #todos = new BehaviorSubject<ToDo[]>([]);
  todos$: Observable<ToDo[]> = this.#todos.asObservable();

  requestToDos() {
    this.#http.get<ToDo[]>('/api/todos').pipe(
      tap(data => {
        this.#todos.next(data);
      })
    ).subscribe();
  }

  getToDos() {
    return this.#todos;
  }

  addToDo(todo: ToDo) {
    this.#todos.next([...this.#todos.value, todo]);
  }

  removeToDo(id: number) {
    // this.#todos.next(this.#todos..filter(todo => todo.id !== id));
  }

  updateToDo(idx: number, config:{ prop: keyof ToDo, value?: any } = { prop: 'status' }) {
    this.#todos.next(this.#todos.value.map(
      (todo: ToDo, index: number) => {
        if (index == idx) {
          if (config.prop == 'status' ) {
            const status = todo.status === 'open' ? 'closed' : 'open';
            return {
              ...todo,
              status
            }
          }

          return {
            ...todo,
            [config.prop]: config.value
          }

        }
        return todo;
      })
    );
  }
}
