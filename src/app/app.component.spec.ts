import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ToDosService } from './services/todos.service';
import { HeaderComponent } from './components/header/header.component';
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let toDoServiceSpy: jasmine.SpyObj<ToDosService>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let routerOutletSpy: jasmine.SpyObj<RouterOutlet>;

  beforeEach(async () => {
    toDoServiceSpy = jasmine.createSpyObj('ToDosService', ['requestToDos', 'requestSkills']);
    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['snapshot'], { params: of({}) });
    routerOutletSpy = jasmine.createSpyObj('RouterOutlet', ['activateEvents']);

    await TestBed.configureTestingModule({
      imports: [HeaderComponent, RouterModule],
      declarations: [AppComponent],
      providers: [
        { provide: ToDosService, useValue: toDoServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: RouterOutlet, useValue: routerOutletSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app component', () => {
    expect(component).toBeTruthy();
  });

  it('should call requestToDos and requestSkills on init', () => {
    component.ngOnInit();

    expect(toDoServiceSpy.requestToDos).toHaveBeenCalled();
    expect(toDoServiceSpy.requestSkills).toHaveBeenCalled();
  });
});
