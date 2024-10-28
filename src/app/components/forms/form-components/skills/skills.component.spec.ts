import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule, ControlContainer, FormGroupDirective } from '@angular/forms';
import { SkillsComponent } from './skills.component';
import { of, Subject } from 'rxjs';
import { FORM_SUBMIT_TOKEN } from 'src/app/helpers/common';
import { ToDosService } from 'src/app/services/todos.service';

describe('SkillsComponent', () => {
  let component: SkillsComponent;
  let fixture: ComponentFixture<SkillsComponent>;
  let formGroupDirective: FormGroupDirective;
  let mockToDosService: jasmine.SpyObj<ToDosService>;
  let mockFormToken: { submitedTrigger$: Subject<void> };

  beforeEach(async () => {
    mockToDosService = jasmine.createSpyObj('ToDosService', ['skills$']);
    mockToDosService.skills$ = of([]);

    mockFormToken = { submitedTrigger$: new Subject<void>() };

    formGroupDirective = new FormGroupDirective([], []);
    formGroupDirective.form = new FormGroup({});

    await TestBed.configureTestingModule({
      imports: [SkillsComponent,ReactiveFormsModule],
      providers: [
        { provide: ControlContainer, useValue: formGroupDirective },
        { provide: ToDosService, useValue: mockToDosService },
        { provide: FORM_SUBMIT_TOKEN, useValue: mockFormToken },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize formArray correctly', () => {
    expect(component.skills.length).toBe(1);
  });

  it('should add a new skill control', () => {
    component.addSkill();
    expect(component.skills.length).toBe(2);
  });

  it('should remove a skill control', () => {
    component.addSkill();
    component.removeSkill(1);
    expect(component.skills.length).toBe(1);
  });

  it('should reset controls when form is submitted', () => {
    spyOn(component.skills.controls[0], 'reset');
    mockFormToken.submitedTrigger$.next();
    expect(component.skills.controls[0].reset).toHaveBeenCalled();
  });
});
