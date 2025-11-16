import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/image-analyzer/pages/image-analyzer-page/image-analyzer-page.component')
      .then(m => m.ImageAnalyzerPageComponent)
  }
];
