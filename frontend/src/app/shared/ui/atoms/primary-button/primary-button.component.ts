import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-primary-button',
  standalone: true,
  templateUrl: './primary-button.component.html',
  styleUrls: ['./primary-button.component.scss']
})
export class PrimaryButtonComponent {
  @Input() label = 'Aceptar';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled = false;
}
