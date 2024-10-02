import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Observable } from 'rxjs';
import { ToDo } from '../models/todo';
import { faker } from '@faker-js/faker';

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

  createDb(): {} | Observable<{}> | Promise<{}> {
    const todos: ToDo[] = [
      ...Array.from({length: 5}, (_, i) => {
        return {
          id: i,
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
}
