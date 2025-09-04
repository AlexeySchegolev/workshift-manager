// Utility functions for handling API errors and validation messages

export interface ApiErrorResponse {
  message?: string;
  error?: string;
  statusCode?: number;
  details?: string[];
  validation?: Array<{
    field: string;
    message: string;
  }>;
}

/**
 * Extracts and formats error messages from API responses
 * @param error - The error object from API call
 * @returns Formatted error message for display
 */
export const extractErrorMessage = (error: any): string => {
  // Handle axios errors
  if (error?.response?.data) {
    const errorData: ApiErrorResponse = error.response.data;
    
    // Handle validation errors with specific field messages
    if (errorData.validation && errorData.validation.length > 0) {
      const validationMessages = errorData.validation
        .map(v => `${v.field}: ${v.message}`)
        .join(', ');
      return `Validierungsfehler: ${validationMessages}`;
    }
    
    // Handle detailed error messages
    if (errorData.details && errorData.details.length > 0) {
      return errorData.details.join(', ');
    }
    
    // Handle single error message
    if (errorData.message) {
      return errorData.message;
    }
    
    // Handle error field
    if (errorData.error) {
      return errorData.error;
    }
    
    // Handle HTTP status specific messages
    if (errorData.statusCode) {
      switch (errorData.statusCode) {
        case 400:
          return 'Ungültige Eingabedaten';
        case 401:
          return 'Nicht autorisiert';
        case 403:
          return 'Zugriff verweigert';
        case 404:
          return 'Ressource nicht gefunden';
        case 409:
          return 'Datenkonflikt';
        case 422:
          return 'Validierungsfehler in den Eingabedaten';
        case 500:
          return 'Interner Serverfehler';
        default:
          return `Fehler ${errorData.statusCode}`;
      }
    }
  }
  
  // Handle network errors
  if (error?.code === 'ECONNREFUSED' || error?.code === 'NETWORK_ERROR') {
    return 'Netzwerkfehler: Server nicht erreichbar';
  }
  
  // Handle timeout errors
  if (error?.code === 'ECONNABORTED') {
    return 'Anfrage-Timeout: Server antwortet nicht';
  }
  
  // Handle generic error messages
  if (error?.message) {
    return error.message;
  }
  
  // Fallback message
  return 'Ein unbekannter Fehler ist aufgetreten';
};

/**
 * Checks if an error is a validation error
 * @param error - The error object from API call
 * @returns true if it's a validation error
 */
export const isValidationError = (error: any): boolean => {
  const errorData: ApiErrorResponse = error?.response?.data;
  return !!(
    (errorData?.validation && errorData.validation.length > 0) || 
    errorData?.statusCode === 422 ||
    errorData?.statusCode === 400
  );
};

/**
 * Checks if an error is a network error
 * @param error - The error object from API call
 * @returns true if it's a network error
 */
export const isNetworkError = (error: any): boolean => {
  return !!(
    error?.code === 'ECONNREFUSED' ||
    error?.code === 'NETWORK_ERROR' ||
    error?.code === 'ECONNABORTED' ||
    !error?.response
  );
};

/**
 * Gets appropriate auto-hide duration based on error type
 * @param error - The error object from API call
 * @returns Duration in milliseconds
 */
export const getErrorDisplayDuration = (error: any): number => {
  if (isValidationError(error)) {
    return 10000; // Longer duration for validation errors so users can read them
  }
  
  if (isNetworkError(error)) {
    return 8000; // Medium duration for network errors
  }
  
  return 6000; // Default duration
};