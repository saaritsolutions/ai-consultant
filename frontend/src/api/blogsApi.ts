import api from './axios';
import type {
  BlogPostDto,
  BlogPostSummaryDto,
  CreateBlogPostDto,
  UpdateBlogPostDto,
} from '../types';

export const getBlogs = (category?: string) =>
  api.get<BlogPostSummaryDto[]>('/blogs', { params: category ? { category } : {} })
     .then((r) => r.data);

export const getCategories = () =>
  api.get<string[]>('/blogs/categories').then((r) => r.data);

export const getBlogBySlug = (slug: string) =>
  api.get<BlogPostDto>(`/blogs/${slug}`).then((r) => r.data);

export const getBlogById = (id: string) =>
  api.get<BlogPostDto>(`/blogs/admin/${id}`).then((r) => r.data);

export const createBlog = (data: CreateBlogPostDto) =>
  api.post<BlogPostDto>('/blogs', data).then((r) => r.data);

export const updateBlog = (id: string, data: UpdateBlogPostDto) =>
  api.put<BlogPostDto>(`/blogs/${id}`, data).then((r) => r.data);

export const deleteBlog = (id: string) =>
  api.delete(`/blogs/${id}`).then((r) => r.data);
