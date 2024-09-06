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
  instructorId?: number;
  images: string[];
  status?: string;
  isPurchased?: boolean;
  purchaseId?: number;
}
