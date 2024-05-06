export interface CartItem {
  id: number;
  name: string;
  price: number;
  imgURL: string;
}

export interface FitnessProgram {
  id: number;
  name: string;
  description?: string;
  category?: string;
  images?: string[];
  price?: number;
  duration?: number;
  difficulty?: string;
  location?: string;
  currency?: string;
}
