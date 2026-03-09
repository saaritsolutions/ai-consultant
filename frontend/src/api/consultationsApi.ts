import api from './axios';
import type { ConsultationDto, CreateConsultationDto } from '../types';

export const createConsultation = (data: CreateConsultationDto) =>
  api.post<ConsultationDto>('/consultations', data).then((r) => r.data);

export const getConsultations = () =>
  api.get<ConsultationDto[]>('/consultations').then((r) => r.data);

export const updateConsultationStatus = (id: string, status: string) =>
  api.patch<ConsultationDto>(`/consultations/${id}/status`, { status }).then((r) => r.data);
