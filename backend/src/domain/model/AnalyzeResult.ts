import type {Tag} from "./Tag.js";

export interface AnalyzeResult {
    tags: Tag[];
    width?: number;
    height?: number;
    providerId?: string;
}