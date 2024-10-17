import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ToDo } from '../models/todo';
import { BehaviorSubject, delay, map, Observable, tap } from 'rxjs';

export type FilterValueStatus = ToDo['status'] | 'all';
export type ResponseStatus = {
  status: unknown;
}
export type RequestToDos = {
  data: ToDo[];
  pagination: { page: number; pageSize: number; pagesCount: number };
} & ResponseStatus;

@Injectable({
  providedIn: 'root'
})
export class ToDosService {
  #http = inject(HttpClient);

  #todos = new BehaviorSubject<ToDo[]>([]);
  todos$: Observable<ToDo[]> = this.#todos.asObservable();
  // todos$: Observable<ToDo[]> = this.#todos.pipe(delay(3000), map(() => {throw 'error';}));
  #skills = new BehaviorSubject<string[]>([]);
  skills$: Observable<string[]> = this.#skills.asObservable();
  totalPages$ = new BehaviorSubject<number>(1);

  requestToDos(status: FilterValueStatus = 'all', page: number, pageSize: number = 10) {
    return this.#http.get<RequestToDos>(`/api/todos?status=${status}&page=${page}&pageSize=${pageSize}`);
  }

  // TODO: move to a separate service
  requestSkills() {
    return this.#http.get<string[]>('/api/skills').pipe(
      tap(skills => this.#skills.next(skills))
    );
  }

  addToDo(todo: Partial<ToDo>) {
    if (!todo.name || !todo.persons || !todo.endDate) {
      throw new Error('Missing required properties to create a new ToDo');
    }

    const newToDo: Partial<ToDo> = {
      name: todo.name,
      persons: todo.persons,
      endDate: todo.endDate,
      status: 'open'
    };

    return this.#http.post<ResponseStatus>('/api/todos', newToDo);
  }

  updateToDo(todo: ToDo) {
    return this.#http.put<ResponseStatus>(`/api/todos/${todo.id}`, todo);
  }
}
