import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkillsComponent } from './skills.component';
import { ToDosService } from 'src/app/services/todos.service';
import { ControlContainer, FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { viewProviders } from 'src/app/directives/form-fields.directive';
import { of, Subject } from 'rxjs';
import { FORM_TOKEN } from 'src/app/helpers/common';

fdescribe('SkillsComponent', () => {
  let component: SkillsComponent;
  let fixture: ComponentFixture<SkillsComponent>;
  let toDosServiceSpy: jasmine.SpyObj<ToDosService>;
  let formSubmitedTrigger$: Subject<void>;

  beforeEach(() => {
    toDosServiceSpy = jasmine.createSpyObj('ToDosService', ['addToDo']);
    toDosServiceSpy.skills$ = of(['Skill 1', 'Skill 2']);

    formSubmitedTrigger$ = new Subject<void>();
    const FORM_TOKEN_MOCK = {
      submitedTrigger$: formSubmitedTrigger$
    };

    const mockFormGroup = new FormGroup({
      skills: new FormArray([new FormControl('')])
    });

    TestBed.configureTestingModule({
      imports: [SkillsComponent, ReactiveFormsModule],
      providers: [
        { provide: ToDosService, useValue: toDosServiceSpy },
        { provide: FORM_TOKEN, useValue: FORM_TOKEN_MOCK}
      ]
    }).overrideComponent(SkillsComponent, {
      remove: { viewProviders: [viewProviders] },
      add: { viewProviders: [{
        provide: ControlContainer,
        useValue: mockFormGroup
      }] }
    }).compileComponents();

    fixture = TestBed.createComponent(SkillsComponent);
    component = fixture.componentInstance;
    component.formArray = mockFormGroup.get('skills') as FormArray;
    component.formArrayName = 'skills';
    component.legend = 'legend';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize skills form array with default value', () => {
    expect(component.skills.length).toBe(1); // Verifica que haya un control inicial
    const firstSkillControl = component.skills.at(0) as FormControl;
    expect(firstSkillControl.value).toBe(''); // El valor inicial debe ser vacío
  });

  it('should add a new skill control when addSkill is called', () => {
    component.addSkill();
    expect(component.skills.length).toBe(2); // Verifica que se haya añadido un segundo control
  });

  it('should not add more than 3 skills', () => {
    component.addSkill(); // Añadir 2da habilidad
    component.addSkill(); // Añadir 3ra habilidad
    component.addSkill(); // Intentar añadir 4ta habilidad (debería ser ignorada)
    expect(component.skills.length).toBe(3); // Debe haber un máximo de 3 controles
  });

  it('should remove a skill control when removeSkill is called', () => {
    component.addSkill(); // Añade una segunda habilidad
    component.removeSkill(1); // Elimina la habilidad añadida
    expect(component.skills.length).toBe(1); // Queda solo el control inicial
  });

  it('should not remove a skill if only one remains', () => {
    component.removeSkill(0); // Intenta eliminar la única habilidad restante
    expect(component.skills.length).toBe(1); // La longitud sigue siendo 1
  });

  it('should reset skills form array on form submit', () => {
    const resetSpy = spyOn(component.skills, 'reset'); // Espía sobre el método reset
    component.formSubmited$.next(); // Simula el envío del formulario
    expect(resetSpy).toHaveBeenCalled(); // Verifica que reset fue llamado
  });

  it('should call the formGroupDirective when form is submitted', () => {
    const cdrSpy = spyOn(component['cdr'], 'markForCheck'); // Espía sobre ChangeDetectorRef
    component.formSubmited$.next(); // Simula el envío del formulario
    expect(cdrSpy).toHaveBeenCalled(); // Verifica que se haya llamado a markForCheck
  });

  it('should not allow duplicate skills (Custom Validator)', () => {
    component.skills.at(0)?.setValue('duplicateSkill'); // Añadir habilidad duplicada
    component.addSkill();
    component.skills.at(1)?.setValue('duplicateSkill'); // Intentar añadir habilidad duplicada
    expect(component.skills.hasError('notDuplicates')).toBe(true); // Verificar si hay error
  });


});
