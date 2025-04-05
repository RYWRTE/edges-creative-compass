
export interface Concept {
  name: string;
  entertaining: number;
  daring: number;
  gripping: number;
  experiential: number;
  subversive: number;
  color?: string;
  source?: 'manual' | 'ai-generated';
  assetUrl?: string;
  kpisObjectives?: string;
  additionalContext?: string;
}
