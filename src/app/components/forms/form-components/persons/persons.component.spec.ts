import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule, ControlContainer, FormGroupDirective } from '@angular/forms';
import { PersonsComponent } from './persons.component';
import { ChangeDetectorRef } from '@angular/core';
import { ToDosService } from 'src/app/services/todos.service';
import { of } from 'rxjs';

describe('PersonsComponent', () => {
  let component: PersonsComponent;
  let fixture: ComponentFixture<PersonsComponent>;
  let formGroupDirective: FormGroupDirective;
  let mockToDosService: jasmine.SpyObj<ToDosService>;

  beforeEach(async () => {
    // required because of skills component dependency
    mockToDosService = jasmine.createSpyObj('ToDosService', ['skills$']);
    mockToDosService.skills$ = of([]);

    formGroupDirective = new FormGroupDirective([], []);
    formGroupDirective.form = new FormGroup({});

    await TestBed.configureTestingModule({
      imports: [PersonsComponent, ReactiveFormsModule],
      providers: [
        { provide: ControlContainer, useValue: formGroupDirective },
        { provide: ToDosService, useValue: mockToDosService },
        { provide: ChangeDetectorRef, useValue: { markForCheck: () => {} } }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize formArray correctly', () => {
    expect(component.persons.length).toBe(1);
  });

  it('should add a new person control', () => {
    component.addPerson();
    expect(component.persons.length).toBe(2);
  });

  it('should remove a person control', () => {
    component.addPerson();
    component.removePerson(1);
    expect(component.persons.length).toBe(1);
  });
});
