export interface FitnessProgram {
  id: number;
  name: string;
  description: string;
  duration: number;
  price: number;
  difficultyLevel: string;
  youtubeUrl: string;
  locationId: number;
  locationName: string;
  categoryId: number;
  categoryName: string;
  instructorName: string;
  images: string[];
}
