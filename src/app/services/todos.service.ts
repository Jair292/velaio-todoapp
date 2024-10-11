import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ToDo } from '../models/todo';
import { BehaviorSubject, finalize, Observable, tap } from 'rxjs';

type requestToDoStatus = ToDo['status'] | 'all';
type requestResponse = {
  data?: ToDo[];
  status: unknown;
  pagination?: { page: number; pageSize: number; pagesCount: number };
};

@Injectable({
  providedIn: 'root'
})
export class ToDosService {
  #http = inject(HttpClient);

  #todos = new BehaviorSubject<ToDo[]>([]);
  todos$: Observable<ToDo[]> = this.#todos.asObservable();
  #skills = new BehaviorSubject<string[]>([]);
  skills$: Observable<string[]> = this.#skills.asObservable();
  loadingToDos$ = new BehaviorSubject<boolean>(true);
  totalPages$ = new BehaviorSubject<number>(0);

  requestToDos(status: requestToDoStatus = 'all', page: number, pageSize: number = 10) {
    return this.#http.get<requestResponse>(`/api/todos?status=${status}&page=${page}&pageSize=${pageSize}`).pipe(
      tap(response => {
        this.#todos.next(response.data || []);
        this.totalPages$.next(response.pagination?.pagesCount || 0);
      }),
      finalize(() => this.loadingToDos$.next(false))
    );
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

    return this.#http.post<requestResponse>('/api/todos', newToDo);
  }

  updateToDo(todo: ToDo, config: { prop: keyof ToDo, value: ToDo[keyof ToDo] }) {
    const updatedTodo = { ...todo, [config.prop]: config.value };

    return this.#http.put<requestResponse>(`/api/todos/${todo.id}`, updatedTodo);
  }
}
