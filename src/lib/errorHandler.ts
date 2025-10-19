/**
 * Security utility for handling errors safely
 * Maps internal errors to user-friendly messages without exposing system details
 */

interface ErrorDetails {
  code?: string;
  message?: string;
}

/**
 * Converts technical errors into safe, user-friendly messages
 * Logs detailed errors only in development mode
 */
export const getUserFriendlyError = (error: any): string => {
  // Log detailed error in development only
  if (import.meta.env.DEV) {
    console.error('[Dev Error]:', error);
  }

  // Handle known Supabase/PostgreSQL error codes
  const errorCode = error?.code || error?.error_code;
  
  if (errorCode === 'PGRST116') {
    return 'The requested item could not be found.';
  }
  
  if (errorCode?.startsWith('23')) {
    // 23xxx are integrity constraint violations
    if (errorCode === '23505') {
      return 'This item already exists.';
    }
    return 'The data you entered is invalid.';
  }
  
  if (errorCode?.startsWith('22')) {
    // 22xxx are data type errors
    return 'Please check your input and try again.';
  }

  // Handle authentication errors
  if (error?.message?.toLowerCase().includes('auth') || 
      error?.message?.toLowerCase().includes('unauthorized')) {
    return 'Authentication failed. Please try logging in again.';
  }

  // Handle network errors
  if (error?.message?.toLowerCase().includes('network') ||
      error?.message?.toLowerCase().includes('fetch')) {
    return 'Connection error. Please check your internet connection.';
  }

  // Generic fallback - never expose internal details
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Safe error logger - only logs in development mode
 */
export const logError = (context: string, error: any): void => {
  if (import.meta.env.DEV) {
    console.error(`[${context}]:`, error);
  }
};
