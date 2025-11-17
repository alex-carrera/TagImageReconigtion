import type { AnalyzeImageUseCaseIn } from '../../domain/port/in/AnalyzeImageUseCaseIn.js';
import { FakeTaggingProviderAdapter } from '../adapter/ia/FakeTaggingProviderAdapter.js';
import {AnalyzeImageUseCase} from "../../aplication/service/AnalyzeImageUseCase.js";

/**
 * Por ahora usamos proveedores FAKE para probar el flujo.
 * Más adelante aquí mismo registraremos los adapters reales:
 *  - GoogleVisionTaggingAdapter
 *  - ImaggaTaggingAdapter
 */
export function createAnalyzeImageUseCase(): AnalyzeImageUseCaseIn {
    const googleFake = new FakeTaggingProviderAdapter('google_vision', false);
    const imaggaFake = new FakeTaggingProviderAdapter('imagga', false);

    // Orden de prioridad por defecto: Google Vision → Imagga
    const providers = [googleFake, imaggaFake];

    return new AnalyzeImageUseCase(providers);
}