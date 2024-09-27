import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Person, ToDo } from 'src/app/models/todo';
import { LoaderComponent } from '../loader/loader.component';
import { ToDoFilterPipe } from 'src/app/pipes/todofilter.pipe';
import { ToDosService } from 'src/app/services/todos.service';
import { ButtonDirective } from 'src/app/directives/button.directive';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, LoaderComponent, ToDoFilterPipe, ButtonDirective, FormsModule],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListComponent {
  toDoService = inject(ToDosService);
  cd = inject(ChangeDetectorRef);

  filterValue: ToDo['status'] | undefined = undefined;
  todos$ = this.toDoService.todos$;

  trackByToDoFn(index: number, item: ToDo): number | string {
    return  item.id;
  }

  trackByPersonFn(index: number, item: Person) {
    return item.name;
  }

  trackBySkillFn(index: number, item: string) {
    return item;
  }

  filter(state: ToDo['status'] | undefined = undefined) {
    this.filterValue = state;
  }

  getStatus(status: ToDo['status']): boolean {
    return status == 'open' ? false : true;
  }

  changeStatus(id: number) {
    this.toDoService.updateToDo(id);
  }
}
