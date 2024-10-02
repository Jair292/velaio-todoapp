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

  requestToDos() {
    return this.#http.get<ToDo[]>('/api/todos');
  }

  requestSkills() {
    return this.#http.get<string[]>('/api/skills');
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

    return this.#http.post('/api/todos', newToDo);
  }

  updateToDo(todo: ToDo, config: { prop: keyof ToDo, value?: any } = { prop: 'status' }) {
    const updatedTodo = { ...todo, ...config };
    console.log('asdasd')
    return this.#http.put(`/api/todos/${todo.id}`, updatedTodo);
  }
}
