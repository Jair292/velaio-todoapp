import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ToDo } from '../models/todo';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { faker } from '@faker-js/faker';

@Injectable({
  providedIn: 'root'
})
export class ToDosService {
  #http = inject(HttpClient);

  #todos = new BehaviorSubject<ToDo[]>([]);
  todos$: Observable<ToDo[]> = this.#todos.asObservable();
  #skills = new BehaviorSubject<string[]>([]);
  skills$: Observable<string[]> = this.#skills.asObservable();

  requestToDos() {
    this.#http.get<ToDo[]>('/api/todos').pipe(
      tap(todos => this.#todos.next(todos))
    ).subscribe();
  }

  requestSkills() {
    this.#http.get<string[]>('/api/skills').pipe(
      tap(skills => this.#skills.next(skills))
    ).subscribe();
  }

  addToDo(todo: Partial<ToDo>) {
    if (!todo.name || !todo.persons || !todo.endDate) {
      throw new Error('Missing required properties to create a new ToDo');
    }

    const newToDo: ToDo = {
      id: faker.number.int({min: 10, max: 100}),
      name: todo.name,
      persons: todo.persons,
      endDate: todo.endDate,
      status: 'open'
    };
    this.#todos.next([...this.#todos.value, newToDo]);

    return this.#http.post('/api/todos', newToDo);
  }

  updateToDo(todo: ToDo, config: { prop: keyof ToDo, value?: any } = { prop: 'status' }) {
    const updatedTodo = { ...todo, [config.prop]: config.value };
    this.#todos.next(this.#todos.value.map(t => t.id === todo.id ? updatedTodo : t));

    return this.#http.put(`/api/todos/${todo.id}`, updatedTodo);
  }
}
