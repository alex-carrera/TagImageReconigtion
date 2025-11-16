import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';

import {FileInputComponent} from '../../atoms/file-input/file-input.component';
import {PrimaryButtonComponent} from '../../atoms/primary-button/primary-button.component';

@Component({
  selector: 'ui-image-upload-panel',
  standalone: true,
  imports: [CommonModule, MatCardModule, FileInputComponent, PrimaryButtonComponent],
  templateUrl: './image-upload-panel.component.html',
  styleUrls: ['./image-upload-panel.component.scss'],
})
export class ImageUploadPanelComponent {
  @Input() loading = false;
  @Output() analyze = new EventEmitter<File>();

  private selectedFile: File | null = null;

  onFileSelected(file: File | null): void {
    this.selectedFile = file;
  }

  onAnalyzeClick(): void {
    if (!this.selectedFile || this.loading) {
      return;
    }

    this.analyze.emit(this.selectedFile);
  }

  get isAnalyzeDisabled(): boolean {
    return !this.selectedFile || this.loading;
  }
}
