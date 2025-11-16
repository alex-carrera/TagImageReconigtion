import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ImageAnalyzerService {
  analyze(_file: File): Promise<unknown> {
    return Promise.resolve({ ok: true });
  }
}
