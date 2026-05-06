export interface ApiSuccess<T> {
  data: T;
  message?: string;
}

export interface ApiFailure {
  error: string;
  message: string;
  statusCode: number;
}

export interface PaginatedMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginatedMeta;
}

export interface ApiResponse<T> {
  data: T;
  meta?: PaginatedMeta;
}

export interface TemplateImage {
  _id: string;
  url: string;
}

export interface Template {
  _id?: string;
  templateKey: string;
  name: string;
  description?: string;
  enable: boolean;
  isDeleted?: boolean;
  primaryColor?: string;
  secondaryColor?: string;
  images: TemplateImage[];
  createdAt?: string;
}

export type ApiError = ApiFailure;