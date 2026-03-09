import api from './axios';
import type { VideoDto, CreateVideoDto, UpdateVideoDto } from '../types';

export const getVideos = () =>
  api.get<VideoDto[]>('/videos').then((r) => r.data);

export const getVideoById = (id: string) =>
  api.get<VideoDto>(`/videos/${id}`).then((r) => r.data);

export const createVideo = (data: CreateVideoDto) =>
  api.post<VideoDto>('/videos', data).then((r) => r.data);

export const updateVideo = (id: string, data: UpdateVideoDto) =>
  api.put<VideoDto>(`/videos/${id}`, data).then((r) => r.data);

export const deleteVideo = (id: string) =>
  api.delete(`/videos/${id}`).then((r) => r.data);
