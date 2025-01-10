export interface Estudo {
  id: string;
  title: string;
  description: string;
  content: string;
  image_url: string;
  created_at: string;
  published: boolean;
  bibliography?: string[];
  author?: string;
  pdf_url?: string;
} 