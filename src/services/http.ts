import axios from 'axios';

import { API_BASE_URL } from '@/config/app-config';
import type { ApiErrorResponse } from '@/contract/inventory';

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return (
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'Nao foi possivel concluir a solicitacao.'
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Nao foi possivel concluir a solicitacao.';
}
