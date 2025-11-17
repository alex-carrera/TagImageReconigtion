import type { AnalyzeImageUseCaseIn } from '../../domain/port/in/AnalyzeImageUseCaseIn.js';
import { ImaggaTaggingAdapter } from '../adapter/ia/ImaggaTaggingAdapter.js';
import {GoogleVisionTaggingAdapter} from "../adapter/ia/GoogleVIsionTagginAdapter.js";
import {AnalyzeImageUseCase} from "../../aplication/service/AnalyzeImageUseCase.js";

export function createAnalyzeImageUseCase(): AnalyzeImageUseCaseIn {
    const googleVision = new GoogleVisionTaggingAdapter();
    const imagga = new ImaggaTaggingAdapter();

    const providers = [googleVision, imagga];

    return new AnalyzeImageUseCase(providers);
}