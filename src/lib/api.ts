import axios from 'axios';
import type { ProcessResponse, QuestionRequest } from '../types';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function uploadPDF(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export async function processPDF(filename: string, outputFormat: 'json' | 'csv' | 'both') {
  const response = await api.get<ProcessResponse>(`/process/${filename}?output_format=${outputFormat}`);
  return response.data;
}

export async function downloadFile(filename: string) {
  const response = await api.get(`/download/${filename}`, {
    responseType: 'blob',
  });
  return response.data;
}

export async function askQuestion(question: string, table: any) {
  const response = await api.post('/ask', {
    question,
    table: Array.isArray(table) ? table : [table],
  });
  return response.data;
}