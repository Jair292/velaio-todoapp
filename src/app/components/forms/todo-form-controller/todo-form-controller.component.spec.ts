import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoFormControllerComponent } from './todo-form-controller.component';

describe('TodoFormControllerComponent', () => {
  let component: TodoFormControllerComponent;
  let fixture: ComponentFixture<TodoFormControllerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoFormControllerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoFormControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
