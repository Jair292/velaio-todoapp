import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoFormComponent } from './todo-form.component';
import { ToDosService } from 'src/app/services/todos.service';
import { FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { Person } from 'src/app/models/todo';

const formValues: { name: string, endDate: string, persons: Person[] } = {
  name: 'ToDo 1',
  endDate: new Date()+'',
  persons: [{ name: 'Person 1', age: 19, skills: ['Skill 1', 'Skill 2'] }]
};

describe('TodoFormComponent', () => {
  let component: TodoFormComponent;
  let fixture: ComponentFixture<TodoFormComponent>;
  let toDoServiceSpy: jasmine.SpyObj<ToDosService>;
  let mockFormGroupDirective: jasmine.SpyObj<FormGroupDirective>;

  beforeEach(() => {
    toDoServiceSpy = jasmine.createSpyObj('ToDosService', ['addToDo']);
    mockFormGroupDirective = jasmine.createSpyObj('FormGroupDirective', ['resetForm', 'form']);
    mockFormGroupDirective.form = { reset: jasmine.createSpy('reset') } as any;

    TestBed.configureTestingModule({
      imports: [TodoFormComponent, ReactiveFormsModule],
      providers: [
        { provide: ToDosService, useValue: toDoServiceSpy },
        { provide: FormGroupDirective, useValue: mockFormGroupDirective }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a ToDo', () => {
    component.todoForm.patchValue(formValues);
    component.onSubmit();
    expect(toDoServiceSpy.addToDo).toHaveBeenCalled();
  });
});
