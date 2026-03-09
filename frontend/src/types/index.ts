// ─── Auth ──────────────────────────────────────────────────────────────────
export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  token: string;
  email: string;
  role: string;
  expiresAt: string;
}

// ─── Blog ──────────────────────────────────────────────────────────────────
export interface BlogPostSummaryDto {
  id: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];
  excerpt: string;
  createdAt: string;
}

export interface BlogPostDto {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogPostDto {
  title: string;
  content: string;
  category: string;
  tags: string[];
}

export interface UpdateBlogPostDto {
  title: string;
  content: string;
  category: string;
  tags: string[];
}

// ─── Video ─────────────────────────────────────────────────────────────────
export interface VideoDto {
  id: string;
  title: string;
  description: string;
  youTubeUrl: string;
  embedUrl: string;
  createdAt: string;
}

export interface CreateVideoDto {
  title: string;
  description: string;
  youTubeUrl: string;
}

export interface UpdateVideoDto {
  title: string;
  description: string;
  youTubeUrl: string;
}

// ─── Consultation ──────────────────────────────────────────────────────────
export interface ConsultationDto {
  id: string;
  name: string;
  email: string;
  organization: string;
  message: string;
  type: string;
  status: string;
  preferredDate: string;
  createdAt: string;
}

export interface CreateConsultationDto {
  name: string;
  email: string;
  organization: string;
  message: string;
  type: string;
  preferredDate: string;
}

// ─── Dashboard ─────────────────────────────────────────────────────────────
export interface DashboardDto {
  totalBlogs: number;
  totalVideos: number;
  totalConsultations: number;
  pendingConsultations: number;
  completedConsultations: number;
  recentConsultations: ConsultationDto[];
}

// ─── Auth Context ──────────────────────────────────────────────────────────
export interface AuthUser {
  email: string;
  role: string;
}
