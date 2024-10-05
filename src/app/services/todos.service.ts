import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ToDo } from '../models/todo';
import { BehaviorSubject, finalize, Observable, tap } from 'rxjs';

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
  updateingToDos$ = new BehaviorSubject<boolean>(false);

  requestToDos(status: ToDo['status'] | 'all' = 'all') {
    return this.#http.get<ToDo[]>(`/api/todos?status=${status}`).pipe(
      tap(todos => this.#todos.next(todos)),
      finalize(() => this.loadingToDos$.next(false))
    );
  }

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

    return this.#http.post('/api/todos', newToDo);
  }

  updateToDo(todo: ToDo, config: { prop: keyof ToDo, value: ToDo[keyof ToDo] }) {
    const updatedTodo = { ...todo, [config.prop]: config.value };

    return this.#http.put(`/api/todos/${todo.id}`, updatedTodo);
  }
}
