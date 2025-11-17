import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageUploadPanelComponent } from '../../../../shared/ui/organisms/image-upload-panel/image-upload-panel.component';

@Component({
  selector: 'app-image-analyzer-page',
  standalone: true,
  imports: [CommonModule, ImageUploadPanelComponent],
  templateUrl: './image-analyzer-page.component.html',
  styleUrls: ['./image-analyzer-page.component.scss'],
})
export class ImageAnalyzerPageComponent {
  // Aquí guardaremos el último archivo seleccionado
  selectedFile: File | null = null;

  onAnalyze(file: File): void {
    this.selectedFile = file;
    // Por ahora solo podemos hacer un console.log, luego llamaremos al servicio
    console.log('Archivo listo para analizar:', file);
  }
}
