import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-container">
      <div class="spinner"></div>
    </div>
  `,
  styles: [
    `
    @import '../../styles/variables.scss';
    .loading-container {
        text-align: center;
        margin-top: 20px;
        display: flex;
        justify-content: center;
      }

      .spinner {
        width: 40px;
        height: 40px;
        border: 5px solid lightgray;
        border-top-color: $main-color;
        border-radius: 50%;
        animation: spin 1s infinite linear;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }`
    ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderComponent {}
