export interface FitnessProgramRequest {
  name: string;
  description: string;
  duration: number;
  price: number;
  difficultyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  categoryId: number;
  locationId?: number;
  youtubeUrl?: string;
  specificAttributes?: { attributeId: number; valueId: number }[];
}
