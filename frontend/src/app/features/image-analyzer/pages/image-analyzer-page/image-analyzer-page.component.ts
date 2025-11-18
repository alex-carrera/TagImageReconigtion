import { Component, signal } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';

import { ImageUploadPanelComponent } from '../../../../shared/ui/organisms/image-upload-panel/image-upload-panel.component';
import { LoadingSpinnerComponent } from '../../../../shared/ui/atoms/loading-spinner/loading-spinner.component';
import { TagComponent } from '../../../../shared/ui/atoms/tag/tag.component';
import { ImageAnalyzerHttpService } from '../../services/image-analyzer.service';
import type { AnalyzeResponse } from '../../models/analyze-response.model';

@Component({
  selector: 'app-image-analyzer-page',
  standalone: true,
  imports: [
    CommonModule,
    ImageUploadPanelComponent,
    LoadingSpinnerComponent,
    TagComponent,
    NgOptimizedImage,
  ],
  templateUrl: './image-analyzer-page.component.html',
  styleUrls: ['./image-analyzer-page.component.scss'],
})
export class ImageAnalyzerPageComponent {
  isLoading = signal(false);
  previewUrl = signal<string | null>(null);
  tags = signal<AnalyzeResponse['tags']>([]);
  error = signal<string | null>(null);
  provider = signal<string | null>(null);

  constructor(private readonly api: ImageAnalyzerHttpService) {}

  onAnalyze(file: File): void {
    this.error.set(null);
    this.tags.set([]);
    this.provider.set(null);

    if (this.previewUrl()) {
      URL.revokeObjectURL(this.previewUrl()!);
    }
    this.previewUrl.set(URL.createObjectURL(file));

    this.isLoading.set(true);

    this.api.analyzeImage(file).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.tags.set(res.tags);
        this.provider.set(res.provider ?? null);

        if (!res.tags.length) {
          this.error.set('La IA no generó etiquetas útiles para esta imagen.');
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.error.set('Error al analizar la imagen.');
      },
    });
  }

}
