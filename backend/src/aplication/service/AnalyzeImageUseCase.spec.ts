import { describe, it, expect } from 'vitest';
import { AnalyzeImageUseCase } from './AnalyzeImageUseCase.js';
import type { TaggingProviderOut } from '../../domain/port/out/TaggingProvidersOut.js';
import type { AnalyzeResult } from '../../domain/model/AnalyzeResult.js';

const successProvider: TaggingProviderOut = {
    id: 'google_vision',
    analyze: async (_image: Buffer): Promise<AnalyzeResult> => ({
        tags: [{ label: 'cat', confidence: 0.9 }],
        providerId: 'google_vision',
    }),
};

const failingProvider: TaggingProviderOut = {
    id: 'imagga',
    analyze: async (_image: Buffer): Promise<AnalyzeResult> => {
        throw new Error('Provider failed');
    },
};

describe('AnalyzeImageUseCase', () => {
    it('should return result from the first working provider', async () => {
        const useCase = new AnalyzeImageUseCase([
            failingProvider,
            successProvider
        ]);

        const result = await useCase.analyzeFromBuffer(Buffer.from('test'));

        expect(result.tags.length).toBe(1);
        expect(result.providerId).toBe('google_vision');
    });

    it('should throw if all providers fail', async () => {
        const useCase = new AnalyzeImageUseCase([
            failingProvider,
            failingProvider
        ]);

        await expect(
            useCase.analyzeFromBuffer(Buffer.from('test'))
        ).rejects.toThrow();
    });
});