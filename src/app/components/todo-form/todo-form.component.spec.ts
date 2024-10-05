import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoFormComponent } from './todo-form.component';
import { ToDosService } from 'src/app/services/todos.service';
import { FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { Person } from 'src/app/models/todo';
import { PersonsComponent } from '../form-components/persons/persons.component';
import { SkillsComponent } from '../form-components/skills/skills.component';
import { of, Subject } from 'rxjs';

const formValues: { name: string; endDate: string; persons: Person[] } = {
  name: "ToDo 1",
  endDate: new Date() + "",
  persons: [
    {
      name: "Person 1",
      age: 19,
      skills: ["Skill 1", "Skill 2"],
    },
  ],
};

describe('TodoFormComponent', () => {
  let component: TodoFormComponent;
  let fixture: ComponentFixture<TodoFormComponent>;
  let toDoServiceSpy: jasmine.SpyObj<ToDosService>;
  let mockFormGroupDirective: jasmine.SpyObj<FormGroupDirective>;
  let submitedTriggerSpy: jasmine.SpyObj<Subject<void>>;

  beforeEach(() => {
    toDoServiceSpy = jasmine.createSpyObj('ToDosService', ['addToDo', 'requestSkills']);
    mockFormGroupDirective = jasmine.createSpyObj('FormGroupDirective', ['resetForm', 'form']);
    mockFormGroupDirective.form = { reset: jasmine.createSpy('reset') } as any;
    submitedTriggerSpy = jasmine.createSpyObj('Subject', ['next']);

    TestBed.configureTestingModule({
      imports: [TodoFormComponent, ReactiveFormsModule, PersonsComponent, SkillsComponent],
      providers: [
        { provide: ToDosService, useValue: toDoServiceSpy },
        { provide: FormGroupDirective, useValue: mockFormGroupDirective }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoFormComponent);
    component = fixture.componentInstance;
    toDoServiceSpy.requestSkills.and.returnValue(of(['Skill 1', 'Skill 2']));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(toDoServiceSpy.requestSkills).toHaveBeenCalled();
  });

  it('should submit when form is valid', () => {
    toDoServiceSpy.addToDo.and.returnValue(of({status: 200}));
    component.todoForm.patchValue(formValues);
    component.onSubmit();

    expect(toDoServiceSpy.addToDo).toHaveBeenCalled();

    // TODO: Validate submitedTrigger subject changed
    // expect(submitedTriggerSpy.next).toHaveBeenCalled();

    // TODO: Validate formGroupDirective reset the form
    // expect(mockFormGroupDirective.resetForm).toHaveBeenCalled();
  });
});
