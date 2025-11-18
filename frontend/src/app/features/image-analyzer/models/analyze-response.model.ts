export interface AnalyzeTag {
  label: string;
  confidence: number;
}

export interface AnalyzeResponse {
  tags: AnalyzeTag[];
  width?: number | null;
  height?: number | null;
  provider?: string | null;
}
