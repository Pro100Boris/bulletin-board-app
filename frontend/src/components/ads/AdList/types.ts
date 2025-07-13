export interface Ad {
  _id: string;
  title: string;
  price: number;
  description: string;
  images?: string[];
  createdAt?: string;
  createdBy?: string;
}