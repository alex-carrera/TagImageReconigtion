export interface AnalyzeImageResponseDto {
    tags: { label: string; confidence: number }[];
    width?: number;
    height?: number;
    provider?: string;
}