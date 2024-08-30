export interface FitnessProgram {
  id: number;
  name: string;
  description: string;
  duration: number;
  price: number;
  difficultyLevel: string;
  youtubeUrl?: string;
  locationName: string;
}
