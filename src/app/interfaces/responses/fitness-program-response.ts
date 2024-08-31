import { Attribute } from "../misc/attribute";

export interface FitnessProgramResponse {
  id: number;
  name: string;
  description: string;
  duration: number;
  price: number;
  difficultyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  youtubeUrl?: string;
  locationId?: number;
  categoryId: number;
  specificAttributes?: Attribute[];
  images?: string[];
}
