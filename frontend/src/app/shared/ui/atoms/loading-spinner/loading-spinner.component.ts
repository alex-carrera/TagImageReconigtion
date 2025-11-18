import { Component, Input } from '@angular/core';

type LoadingSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ui-loading',
  standalone: true,
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss'],
})
export class LoadingSpinnerComponent {
  /** Texto accesible/visible junto al spinner */
  @Input() text = 'Cargando...';
  /** Clase de color Tailwind aplicada al icono (ej: 'text-cyan-400') */
  @Input() colorClass = 'text-cyan-400';
  /** Tamaño del spinner */
  @Input() size: LoadingSize = 'md';

  get sizeClass(): string {
    switch (this.size) {
      case 'sm':
        return 'h-5 w-5';
      case 'lg':
        return 'h-8 w-8';
      case 'md':
      default:
        return 'h-6 w-6';
    }
  }
}
