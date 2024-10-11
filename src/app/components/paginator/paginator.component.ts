import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonDirective } from 'src/app/directives/button.directive';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [CommonModule, ButtonDirective],
  template: `
    <ng-container *ngIf="currentPage$ | async as currentPage">
      <button (click)="changePage(currentPage - 1)" [disabled]="currentPage <= 1">﹤</button>
      <span>page {{currentPage}} of {{totalPages}}</span>
      <button (click)="changePage(currentPage +1)" [disabled]="currentPage >= totalPages">﹥</button>
    </ng-container>
  `,
  styles: [
    `
      @use '../../styles/button' as button;
      @use '../../styles/variables' as variables;
      :host {
        width: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin-top: 8px;
        font-size: variables.$font-size-small;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginatorComponent {
  @Input()
  set page(value: number) {
    this.currentPage$.next(value || 1);
  }
  @Input({required: true}) totalPages: number = 1;
  @Output() pageChanged = new EventEmitter<number>();

  currentPage$ = new BehaviorSubject<number>(1);

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChanged.emit(page);
      this.currentPage$.next(page);
    }
  }
}
