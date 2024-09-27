import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { NavigationEnd } from '@angular/router';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let eventsSubject: Subject<NavigationEnd>;

  beforeEach(async () => {
    eventsSubject = new Subject<NavigationEnd>();
    routerSpy = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl'], { events: eventsSubject.asObservable() });
    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['']);

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update currentUrl on NavigationEnd event', () => {
    const url = '/some-route';
    eventsSubject.next(new NavigationEnd(0, url, url));
    expect(component.currentUrl).toBe(url);
  });
});
