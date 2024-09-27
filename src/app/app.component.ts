import { Component, inject } from '@angular/core';
import { ToDosService } from './services/todos.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'velaio-todoapp';
  toDoService = inject(ToDosService);

  ngOnInit() {
    this.toDoService.requestToDos();
    this.toDoService.requestSkills();
  }
}
