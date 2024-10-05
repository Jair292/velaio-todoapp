import { Injectable } from '@angular/core';
import { InMemoryDbService, ResponseOptions, STATUS } from 'angular-in-memory-web-api';
import { Observable } from 'rxjs';
import { ToDo } from '../models/todo';
import { faker } from '@faker-js/faker';
import { HttpHeaders } from '@angular/common/http';

const skillsList = [
  'Angular',
  'React',
  'Vue',
  'Svelte',
  'Next',
  'Nest',
  'Nuxt',
  'Laravel',
  'Symfony'
];

const todoNames = [
  'Create Button',
  'Create selector',
  'Create Form',
  'Create Service',
  'Edit Button',
  'Edit selector',
  'Edit Form',
  'Edit Service',
]

@Injectable({
  providedIn: 'root'
})
export class InmemoryService implements InMemoryDbService {

  generateRandomId(min: number = 1, max: number = 1000000): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  createDb(): {} | Observable<{}> | Promise<{}> {
    const todos: ToDo[] = [
      ...Array.from({length: 5}, (_, i) => {
        return {
          id: this.generateRandomId(),
          name: faker.helpers.arrayElement(todoNames),
          endDate: faker.date.recent(),
          status: faker.helpers.arrayElement(['open', 'closed']),
          persons: [
            {
              name: `${faker.person.firstName()} ${faker.person.lastName()}`,
              age: faker.number.int({min: 18, max: 45}),
              skills: [faker.helpers.arrayElement(skillsList)]
            }
          ]
        }
      })
    ];

    const skills = skillsList;
    console.log('inmemory service is working');
    return { todos, skills };
  }


  /**
   *
   * @param requestInfo unsafe type because limitation in the interface
   * @returns
   */
  get(requestInfo: any) {
    const collectionName = requestInfo.collectionName;

    if (collectionName === 'todos') {
      const statusFilter = requestInfo.query.get('status');
      const status = statusFilter[0];
      let data = requestInfo.collection;

      if (status !== 'all') {
        if (statusFilter && statusFilter.length) {
          data = data.filter((todo: any) => todo.status === status);
        }
      }

      const options: ResponseOptions = {
        body: data,
        status: STATUS.OK,
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      };

      return requestInfo.utils.createResponse$(() => options);
    }

    return undefined;
  }

  /**
   *
   * @param requestInfo unsafe type because limitation in the interface
   * @returns
   */
  post(requestInfo: any) {
    var collectionName = requestInfo.collectionName;

    if (collectionName === 'todos') {
      const collection = requestInfo.collection as ToDo[];
      let item = requestInfo.utils.getJsonBody(requestInfo.req)
      item["id"] = this.generateRandomId();
      collection.push(item);

      const options: ResponseOptions = {
        status: STATUS.OK
      };

      return requestInfo.utils.createResponse$(() => options);
    }
    return undefined;
  }

  /**
   *
   * @param requestInfo unsafe type because limitation in the interface
   * @returns
   */
  put(requestInfo: any) {
    var collectionName = requestInfo.collectionName;

    if (collectionName === 'todos') {
      const collection = requestInfo.collection as ToDo[];

      let status = STATUS.NOT_FOUND

      collection.forEach(todo => {
        if (todo.id === requestInfo.id) {
          Object.assign(todo, requestInfo.utils.getJsonBody(requestInfo.req));
          status = STATUS.OK
        }
      })

      const options: ResponseOptions = {
        status: status
      };

      return requestInfo.utils.createResponse$(() => options);
    }
    return undefined;
  }
}
