export interface AnalyzeTag {
  name: string;
  confidence: number;
}

export interface AnalyzeResponse {
  tags: AnalyzeTag[];
  width?: number;
  height?: number;
}
