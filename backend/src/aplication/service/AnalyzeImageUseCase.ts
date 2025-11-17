import type { AnalyzeImageUseCaseIn, AnalyzeOptions } from '../../domain/port/in/AnalyzeImageUseCaseIn.js';
import type { TaggingProviderOut } from '../../domain/port/out/TaggingProvidersOut.js';
import type { AnalyzeResult } from '../../domain/model/AnalyzeResult.js';
import type { ProviderId } from '../../domain/model/ProviderId.js';

export class AnalyzeImageUseCase implements AnalyzeImageUseCaseIn {
    constructor(private readonly providers: TaggingProviderOut[]) {
        if (!providers || providers.length === 0) {
            throw new Error('At least one tagging provider must be configured');
        }
    }

    async analyzeFromBuffer(image: Buffer, options?: AnalyzeOptions): Promise<AnalyzeResult> {
        if (!image || image.length === 0) {
            throw new Error('Image buffer is empty');
        }

        const orderedProviders = this.resolveProvidersOrder(options?.providerPreference);
        let lastError: unknown = null;

        for (const provider of orderedProviders) {
            try {
                const rawResult = await provider.analyze(image, options);
                const result = this.applyPostFilters(rawResult, options);

                if (!result.tags || result.tags.length === 0) {
                    console.warn(
                        `[AnalyzeImageUseCase] Provider ${provider.id} returned empty tags after filters, trying next provider...`
                    );
                    lastError =
                        lastError ??
                        new Error(`Provider ${provider.id} returned empty tags after filtering.`);
                    continue;
                }

                return result;
            } catch (err) {
                console.error(`[AnalyzeImageUseCase] Provider ${provider.id} failed`, err);
                lastError = err;
            }
        }

        throw lastError ?? new Error('All tagging providers failed or returned empty tags');
    }

    private resolveProvidersOrder(
        preference?: ProviderId | 'auto'
    ): TaggingProviderOut[] {
        if (!preference || preference === 'auto') {
            return this.providers;
        }

        const preferred = this.providers.find((p) => p.id === preference);
        const others = this.providers.filter((p) => p.id !== preference);

        if (!preferred) {
            return this.providers;
        }

        return [preferred, ...others];
    }

    private applyPostFilters(result: AnalyzeResult, options?: AnalyzeOptions): AnalyzeResult {
        let tags = result.tags ?? [];

        if (options?.minConfidence !== undefined) {
            tags = tags.filter((t) => t.confidence >= options.minConfidence!);
        }

        if (options?.maxTags !== undefined && options.maxTags > 0) {
            tags = tags.slice(0, options.maxTags);
        }

        return {
            ...result,
            tags,
        };
    }
}