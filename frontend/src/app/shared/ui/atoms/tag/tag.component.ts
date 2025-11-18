import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-tag',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
})
export class TagComponent {
  /** Texto del tag */
  @Input() label = '';
  /** Confianza entre 0 y 1 */
  @Input() confidence = 0;

  // Devuelve clases Tailwind según la confianza
  get toneClasses(): string {
    const c = Number(this.confidence) || 0;
    if (c >= 0.85) return 'bg-emerald-700 text-emerald-50'; // alta
    if (c >= 0.7) return 'bg-cyan-700 text-cyan-50'; // buena
    if (c >= 0.5) return 'bg-amber-700 text-amber-50'; // media
    return 'bg-rose-700 text-rose-50'; // baja
  }
}
