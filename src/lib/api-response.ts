/**
 * BrightLoop Subscription Management System
 * Standard API Response Envelope
 * Document Reference: docs/04_Database_API_Contract.md (Section 12.1)
 */

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    fields?: Record<string, string>;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export function successResponse<T>(data: T, message: string = 'Operation completed'): ApiSuccessResponse<T> {
  return {
    success: true,
    data,
    message,
  };
}

export function errorResponse(
  message: string,
  code: string = 'BAD_REQUEST',
  fields?: Record<string, string>
): ApiErrorResponse {
  return {
    success: false,
    error: {
      code,
      message,
      fields,
    },
  };
}
