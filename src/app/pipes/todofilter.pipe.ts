import { Pipe, PipeTransform } from '@angular/core';
import { ToDo } from '../models/todo';

@Pipe({
  name: 'toDoFilter',
  standalone: true,
  pure: true
})
export class ToDoFilterPipe implements PipeTransform {

  transform(value: ToDo[] | null, filterValue: string | undefined): ToDo[] {
    if (!value) {
      return [];
    }
    if (!filterValue) {
      return value;
    }
    return value.filter(todo => todo.status == filterValue);
  }
}
