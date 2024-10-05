import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ToDosService } from './todos.service';
import { ToDo } from '../models/todo';
import { skip, take } from 'rxjs';

describe('ToDosService', () => {
  let service: ToDosService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ToDosService]
    });

    service = TestBed.inject(ToDosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch ToDos and update #todos BehaviorSubject', () => {
    const mockToDos: ToDo[] = [
      { id: 1, name: 'Test ToDo', status: 'open', endDate: new Date(), persons: [{ name: 'John Doe', age: 30, skills: ['coding'] }] }
    ];

    service.requestToDos().subscribe();

    const req = httpMock.expectOne('/api/todos?status=all');
    expect(req.request.method).toBe('GET');
    req.flush(mockToDos);

    service.todos$.subscribe(todos => {
      expect(todos.length).toBe(1);
      expect(todos).toEqual(mockToDos);
    });
  });

  it('should make an HTTP GET request and update the #skills BehaviorSubject', () => {
    const mockSkills = ['JavaScript', 'Angular', 'TypeScript'];

    service.requestSkills().subscribe();
    const req = httpMock.expectOne('/api/skills');
    expect(req.request.method).toBe('GET');
    req.flush(mockSkills);

    service.skills$.subscribe((skills) => {
      expect(skills).toEqual(mockSkills);
    });
  });

  it('should add a new ToDo', () => {
    const todo: Partial<ToDo> = { name: 'New ToDo', persons: [{ name: 'John Doe', age: 30, skills: ['coding'] }], endDate: new Date() };

    service.addToDo(todo).subscribe();
    const req = httpMock.expectOne('/api/todos');
    expect(req.request.method).toBe('POST');
    req.flush(todo);

    service.todos$.pipe(skip(1)).subscribe(todos => {
      expect(todos.length).toBe(1);
      expect(todos[0].name).toBe(todo.name as string);
    });
  });

  it('should throw an error if required fields are missing when adding a ToDo', () => {
    expect(() => {
      service.addToDo({ name: 'Incomplete ToDo' });
    }).toThrowError('Missing required properties to create a new ToDo');
  });

  it('should update a ToDo status', () => {
    const initialToDo: ToDo = {
      id: 1,
      name: "Test ToDo",
      persons: [],
      endDate: new Date(),
      status: "open",
    };

    service.addToDo(initialToDo);

    service.todos$.pipe(skip(2)).subscribe(todos => {
      expect(todos[0].status).toBe('closed');
    });

    service.updateToDo(initialToDo, { prop: 'status', value: 'closed' });
  });

  it('should update a property of a ToDo when updateToDo is called with a specific property', () => {
    const initialToDo: ToDo = {
      id: 1,
      name: "Initial ToDo",
      status: "open",
      endDate: new Date(),
      persons: [{ name: "John Smith", age: 35, skills: ["development"] }],
    };

    service.addToDo(initialToDo);

    service.todos$.pipe(skip(2)).subscribe(todos => {
      expect(todos[0].name).toBe('Updated ToDo');
    });

    service.updateToDo(
      {
        id: 1,
        name: "Initial ToDo",
        status: "open",
        endDate: new Date(),
        persons: [{ name: "John Smith", age: 35, skills: ["development"] }],
      },
      { prop: "name", value: "Updated ToDo" }
    );
  });
});
