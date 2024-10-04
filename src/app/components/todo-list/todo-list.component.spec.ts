// todo-list.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoListComponent } from './todo-list.component';
import { ToDosService } from 'src/app/services/todos.service';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonDirective } from 'src/app/directives/button.directive';
import { ToDoFilterPipe } from 'src/app/pipes/todofilter.pipe';
import { LoaderComponent } from '../loader/loader.component';
import { Person, ToDo } from 'src/app/models/todo';
import { of } from 'rxjs';

const person: Person = {
  name: 'test',
  age: 20,
  skills: ['test']
};

const toDo: ToDo = {
  id: 1,
  name: 'test',
  status: 'open',
  endDate: new Date(),
  persons: [
    person
  ]
};

describe('TodoListComponent', () => {
  let component: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;
  let toDoServiceSpy: jasmine.SpyObj<ToDosService>;
  let changeDetectorRefSpy: jasmine.SpyObj<ChangeDetectorRef>;

  beforeEach(async () => {
    toDoServiceSpy = jasmine.createSpyObj('ToDosService', ['todos$', 'updateToDo']);
    changeDetectorRefSpy = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

    await TestBed.configureTestingModule({
      imports: [CommonModule, LoaderComponent, ToDoFilterPipe, ButtonDirective, FormsModule, TodoListComponent],
      providers: [
        { provide: ToDosService, useValue: toDoServiceSpy },
        { provide: ChangeDetectorRef, useValue: changeDetectorRefSpy }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call updateToDo method of ToDosService when changeStatus method is called', () => {
    const initialToDo: ToDo = {
      id: 1,
      name: "Initial ToDo",
      status: "open",
      endDate: new Date(),
      persons: [{ name: "John Smith", age: 35, skills: ["development"] }],
    };


    const expectedStatus = "closed";
    toDoServiceSpy.updateToDo.and.returnValue(of({...initialToDo, status: expectedStatus}));

    component.changeStatus(initialToDo);
    expect(toDoServiceSpy.updateToDo).toHaveBeenCalledWith(initialToDo, { prop: 'status', value: expectedStatus});
  });

  it('should return item id when trackByToDoFn method is called', () => {
    const result = component.trackByToDoFn(0, toDo);
    expect(result).toBe(toDo.id);
  });

  it('should return item name when trackByPersonFn method is called', () => {
    const result = component.trackByPersonFn(0, person);
    expect(result).toBe(person.name);
  });

  it('should return item when trackBySkillFn method is called', () => {
    const item = 'Angular';
    const result = component.trackBySkillFn(0, item);
    expect(result).toBe(item);
  });

  it('should return false when getStatus method is called with open status', () => {
    const status = 'open';
    const result = component.getStatus(status);
    expect(result).toBeFalse();
  });

  it('should return true when getStatus method is called with closed status', () => {
    const status = 'closed';
    const result = component.getStatus(status);
    expect(result).toBeTrue();
  });
});
