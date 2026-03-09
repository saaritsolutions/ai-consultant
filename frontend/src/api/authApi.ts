import api from './axios';
import type { LoginDto, LoginResponseDto } from '../types';

export const login = (data: LoginDto) =>
  api.post<LoginResponseDto>('/auth/login', data).then((r) => r.data);
