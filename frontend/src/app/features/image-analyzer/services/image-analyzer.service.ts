import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { AnalyzeResponse } from '../models/analyze-response.model';
import {environment} from '../../../../environments/environment';

export interface AnalyzeRequestOptions {
  providerPreference?: 'auto' | 'google_vision' | 'imagga';
  maxTags?: number;
  minConfidence?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ImageAnalyzerHttpService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  analyzeImage(
    file: File,
    _options?: AnalyzeRequestOptions
  ): Observable<AnalyzeResponse> {
    const formData = new FormData();
    formData.append('image', file);

    // Más adelante podríamos añadir options al body o querystring
    return this.http.post<AnalyzeResponse>(`${this.baseUrl}/analyze`, formData);
  }
}
