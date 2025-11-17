import type { AnalyzeImageUseCaseIn } from '../../domain/port/in/AnalyzeImageUseCaseIn.js';
import { ImaggaTaggingAdapter } from '../adapter/ia/ImaggaTaggingAdapter.js';
import { FakeTaggingProviderAdapter } from '../adapter/ia/FakeTaggingProviderAdapter.js';
import {AnalyzeImageUseCase} from "../../aplication/service/AnalyzeImageUseCase.js";

export function createAnalyzeImageUseCase(): AnalyzeImageUseCaseIn {
    const imagga = new ImaggaTaggingAdapter();

    // Temporal: Google Vision aún fake
    const googleFake = new FakeTaggingProviderAdapter('google_vision', false);

    // Orden de prioridad: primero Imagga, luego Google fake
    const providers = [imagga];

    return new AnalyzeImageUseCase(providers);
}