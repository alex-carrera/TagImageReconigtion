import type { TaggingProviderOut } from '../../../domain/port/out/TaggingProvidersOut.js';
import type { AnalyzeOptions } from '../../../domain/port/in/AnalyzeImageUseCaseIn.js';
import type { AnalyzeResult } from '../../../domain/model/AnalyzeResult.js';
import type { ProviderId } from '../../../domain/model/ProviderId.js';

export class FakeTaggingProviderAdapter implements TaggingProviderOut {
    constructor(
        public readonly id: ProviderId,
        private readonly shouldFail: boolean = false
    ) {}

    async analyze(_image: Buffer, _options?: AnalyzeOptions): Promise<AnalyzeResult> {
        if (this.shouldFail) {
            throw new Error(`Fake failure in provider ${this.id}`);
        }

        return {
            tags: [
                { label: `fake-tag-1-from-${this.id}`, confidence: 0.95 },
                { label: `fake-tag-2-from-${this.id}`, confidence: 0.88 },
            ],
            width: 800,
            height: 600,
            providerId: this.id,
        };
    }
}