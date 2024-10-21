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

const skillsList2 = [
  'Javascript',
  'Typescript',
  'C#',
  'C++',
  'C',
  'Python',
  'PHP',
  'Ruby'
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
      ...Array.from({length: 100}, (_, i) => {
        return {
          id: this.generateRandomId(),
          name: `${faker.helpers.arrayElement(todoNames)}-${i+1}`,
          endDate: faker.date.recent(),
          status: faker.helpers.arrayElement(['open', 'closed']),
          persons: [
            {
              name: `${faker.person.firstName()} ${faker.person.lastName()}`,
              age: faker.number.int({min: 18, max: 45}),
              skills: [faker.helpers.arrayElement(skillsList), faker.helpers.arrayElement(skillsList2)]
            }
          ]
        }
      })
    ];

    const skills = [...skillsList, skillsList2];
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
      const page = +requestInfo.query.get('page')[0];
      const pageSize = requestInfo.query.get('pageSize') ? requestInfo.query.get('pageSize')[0] : 10;

      // Remove page and pageSize from query parameters so they're not considered as filtering parameters for the
      // collection later on.
      requestInfo.query.delete('page');
      requestInfo.query.delete('pageSize');

      const statusFilter = requestInfo.query.get('status');
      const status = statusFilter[0];
      let data = requestInfo.collection;

      if (status !== 'all') {
        if (statusFilter && statusFilter.length) {
          data = data.filter((todo: any) => todo.status === status);
        }
      }

      const pagesCount = Math.ceil(data.length / pageSize);

      if (page > pagesCount) {
        data = [];
      } else {
        data = data.slice((page - 1) * pageSize, page * pageSize);
      }

      const options: ResponseOptions = {
        body: {
          data,
          pagination: {
            page,
            pageSize,
            pagesCount,
          },
          status: STATUS.OK
        },
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
        body: {
          status: STATUS.OK
        },
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

      for (let todo of collection) {
        if (todo.id === requestInfo.id) {
          todo = requestInfo.utils.getJsonBody(requestInfo.req);
          status = STATUS.OK
          break;
        }
      }

      const options: ResponseOptions = {
        body: {
          status: status
        },
        status: status
      };

      return requestInfo.utils.createResponse$(() => options);
    }
    return undefined;
  }
}
