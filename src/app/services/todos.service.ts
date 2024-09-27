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
      tap(data => {
        this.#todos.next(data);
      })
    ).subscribe();
  }

  requestSkills() {
    this.#http.get<string[]>('/api/skills').pipe(
      tap(data => {
        this.#skills.next(data);
      })
    ).subscribe();
  }

  getToDos() {
    return this.#todos;
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
  }

  updateToDo(id: number, config:{ prop: keyof ToDo, value?: any } = { prop: 'status' }) {
    const updatedTodos: ToDo[] = this.#todos.value.map((todo: ToDo) => {
      if (todo.id === id) {
        if (config.prop === 'status') {
          const status = todo.status === 'open' ? 'closed' : 'open';
          return {
            ...todo,
            status
          };
        }
        return {
          ...todo,
          [config.prop]: config.value
        };
      }
      return todo;
    });

    this.#todos.next(updatedTodos);
  }
}
