export type Product = {
  id?: string;
  name: string;
  category: 'food' | 'supply' | 'health';
  quantity: number;
  created_at?: string;
  updated_at?: string;
};
