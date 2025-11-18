import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileInputComponent } from '../../atoms/file-input/file-input.component';
import { PrimaryButtonComponent } from '../../atoms/primary-button/primary-button.component';

@Component({
  selector: 'ui-image-upload-panel',
  standalone: true,
  imports: [CommonModule, FileInputComponent, PrimaryButtonComponent],
  templateUrl: './image-upload-panel.component.html',
  styleUrls: ['./image-upload-panel.component.scss'],
})
export class ImageUploadPanelComponent {
  @Output() analyze = new EventEmitter<File>();

  selectedFile: File | null = null;

  onFileSelected(file: File | null): void {
    this.selectedFile = file;
  }

  onAnalyzeClick(): void {
    if (!this.selectedFile) {
      return;
    }
    this.analyze.emit(this.selectedFile); // 👈 emitimos File, no Event
  }
}
