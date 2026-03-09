import api from './axios';
import type { DashboardDto } from '../types';

export const getDashboard = () =>
  api.get<DashboardDto>('/dashboard').then((r) => r.data);
