import type { TaggingProviderOut } from '../../../domain/port/out/TaggingProvidersOut.js';
import type { AnalyzeOptions } from '../../../domain/port/in/AnalyzeImageUseCaseIn.js';
import type { AnalyzeResult } from '../../../domain/model/AnalyzeResult.js';
import type { ProviderId } from '../../../domain/model/ProviderId.js';
import { env } from '../../../config/env/index.js';

interface GoogleVisionLabelAnnotation {
    description?: string;
    score?: number; // 0–1
}

interface GoogleVisionAnnotateResponse {
    labelAnnotations?: GoogleVisionLabelAnnotation[];
    error?: { message?: string };
}

interface GoogleVisionResponse {
    responses?: GoogleVisionAnnotateResponse[];
}

export class GoogleVisionTaggingAdapter implements TaggingProviderOut {
    public readonly id: ProviderId = 'google_vision';

    async analyze(image: Buffer, options?: AnalyzeOptions): Promise<AnalyzeResult> {
        const base64Image = image.toString('base64');

        const url = `${env.googleVision.endpoint}?key=${encodeURIComponent(
            env.googleVision.apiKey
        )}`;

        const body = {
            requests: [
                {
                    image: { content: base64Image },
                    features: [
                        {
                            type: 'LABEL_DETECTION',
                            maxResults: options?.maxTags ?? 10,
                        },
                    ],
                },
            ],
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(
                `Google Vision HTTP error: ${response.status} ${response.statusText}`
            );
        }

        const data = (await response.json()) as GoogleVisionResponse;

        const first = data.responses?.[0];
        if (!first) throw new Error('Google Vision: empty response');

        if (first.error) {
            throw new Error(`Google Vision error: ${first.error.message}`);
        }

        const labels = first.labelAnnotations ?? [];

        const tags = labels.map((l) => ({
            label: l.description ?? 'unknown',
            confidence: l.score ?? 0,
        }));

        return {
            tags,
            providerId: this.id,
        };
    }
}