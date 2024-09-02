import { Attribute } from "./attribute";

export interface Category {
  id: number;
  name: string;
  description: string;
  attributes: Attribute[];
}
