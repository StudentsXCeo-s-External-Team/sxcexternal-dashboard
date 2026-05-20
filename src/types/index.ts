export interface Event {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  start_date: string;
  end_date: string | null;
  location: string | null;
  registration_url: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface News {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  author: string | null;
  slug: string;
  images: string[];
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface GalleryPhoto {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string;
  category: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Member {
  id: string;
  name: string;
  position: string | null;
  department: string | null;
  photo_url: string | null;
  period: string | null;
  bio: string | null;
  social_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Admin {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
