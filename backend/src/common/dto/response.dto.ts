export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export class SuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  meta?: PaginationMeta;

  constructor(message: string, data: T, meta?: any) {
    this.success = true;
    this.message = message;
    this.data = data;
    this.meta = meta;
  }
}

export class ErrorResponse {
  success: false;
  message: string;
  error: {
    code: string;
    details?: any;
  };

  constructor(message: string, code: string, details?: any) {
    this.success = false;
    this.message = message;
    this.error = {
      code,
      details,
    };
  }
}
