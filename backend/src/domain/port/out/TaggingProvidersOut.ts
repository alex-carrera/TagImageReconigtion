import type {ProviderId} from "../../model/ProviderId.js";
import type {AnalyzeOptions} from "../in/AnalyzeImageUseCaseIn.js";
import type {AnalyzeResult} from "../../model/AnalyzeResult.js";

export interface TaggingProviderOut {
    id: ProviderId;

    analyze(image: Buffer, options?: AnalyzeOptions): Promise<AnalyzeResult>;
}