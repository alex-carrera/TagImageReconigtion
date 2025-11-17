import type {ProviderId} from "../../model/ProviderId.js";
import type {AnalyzeResult} from "../../model/AnalyzeResult.js";

export interface AnalyzeOptions {
    providerPreference?: ProviderId | 'auto';
    maxTags?: number;
    minConfidence?: number;
}

export interface AnalyzeImageUseCaseIn {
    analyzeFromBuffer(image: Buffer, options?: AnalyzeOptions): Promise<AnalyzeResult>;
}