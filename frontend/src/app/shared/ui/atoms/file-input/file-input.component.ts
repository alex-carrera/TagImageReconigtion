import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'ui-file-input',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.scss'],
})
export class FileInputComponent {
  @Output() fileSelected = new EventEmitter<File | null>();

  fileName = 'Ningún archivo seleccionado';

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    if (file) {
      this.fileName = file.name;
      this.fileSelected.emit(file);
    } else {
      this.fileName = 'Ningún archivo seleccionado';
      this.fileSelected.emit(null);
    }
  }
}
