import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'ui-primary-button',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './primary-button.component.html',
  styleUrls: ['./primary-button.component.scss']
})
export class PrimaryButtonComponent {
  @Input() label = 'Aceptar';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled = false;
}
