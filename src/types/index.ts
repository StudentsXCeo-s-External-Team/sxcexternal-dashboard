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
  role_type: "executive" | "management" | "associate";
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

export interface Program {
  id: string;
  slug: string;
  badge: string;
  category: string;
  title: string;
  month: string;
  audience: string;
  cover: string;
  hero: string;
  images: string[];
  excerpt: string;
  content: string;
  highlights: string[];
  is_published: boolean;
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

export interface Resource {
  id: string;
  slug: string;
  badge: string;
  category: string;
  title: string;
  month: string;
  audience: string;
  cover: string;
  hero: string;
  excerpt: string;
  content: string;
  highlights: string[];
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Partner {
  id: string;
  name: string;
  logo_url: string;
  partner_type: "corporate" | "media" | "community";
  website_url: string | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
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
