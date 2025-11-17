import type { TaggingProviderOut } from '../../../domain/port/out/TaggingProvidersOut.js';
import type { AnalyzeOptions } from '../../../domain/port/in/AnalyzeImageUseCaseIn.js';
import type { AnalyzeResult } from '../../../domain/model/AnalyzeResult.js';
import type { ProviderId } from '../../../domain/model/ProviderId.js';

import { env } from '../../../config/env/index.js';

interface ImaggaTag {
    confidence: number;
    tag: Record<string, string>;
}

interface ImaggaResponse {
    result?: {
        tags?: ImaggaTag[];
    };
}

export class ImaggaTaggingAdapter implements TaggingProviderOut {
    public readonly id: ProviderId = 'imagga';

    async analyze(image: Buffer, _options?: AnalyzeOptions): Promise<AnalyzeResult> {
        const base64Image = image.toString('base64');

        const url = env.imagga.endpoint;

        const authHeader = Buffer.from(
            `${env.imagga.apiKey}:${env.imagga.apiSecret}`
        ).toString('base64');

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Basic ${authHeader}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                image_base64: base64Image,
            }),
        });

        if (!response.ok) {
            throw new Error(`Imagga API error: ${response.status} ${response.statusText}`);
        }

        const data = (await response.json()) as ImaggaResponse;

        const tagsRaw = data.result?.tags ?? [];

        const tags = tagsRaw.map((t) => ({
            label: t.tag?.en ?? 'unknown',
            confidence: Number(t.confidence) / 100, // 0–100 → 0–1
        }));

        return {
            tags,
            providerId: this.id,
        };
    }
}