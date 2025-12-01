/**
 * Error handling utilities with helpful user messages
 */

/**
 * Error types for better categorization
 */
export const ERROR_TYPES = {
  ADDRESS_NOT_FOUND: 'address_not_found',
  NETWORK_ERROR: 'network_error',
  TIMEOUT: 'timeout',
  INVALID_RESPONSE: 'invalid_response',
  API_ERROR: 'api_error',
  VALIDATION_ERROR: 'validation_error',
  UNKNOWN: 'unknown',
};

/**
 * User-friendly error messages
 */
export const ERROR_MESSAGES = {
  [ERROR_TYPES.ADDRESS_NOT_FOUND]: {
    title: 'Location Not Found',
    message: 'We couldn\'t find the address you entered. Please check the spelling and try again.',
    suggestions: [
      'Include city and country for better results',
      'Try using landmarks or well-known places',
      'Check for typos in the address',
    ],
  },
  [ERROR_TYPES.NETWORK_ERROR]: {
    title: 'Connection Error',
    message: 'Unable to connect to the server. Please check your internet connection and try again.',
    suggestions: [
      'Check your internet connection',
      'Try refreshing the page',
      'Wait a moment and try again',
    ],
  },
  [ERROR_TYPES.TIMEOUT]: {
    title: 'Request Timeout',
    message: 'The request took too long to complete. Please try again.',
    suggestions: [
      'Check your internet speed',
      'Try simplifying the route',
      'Retry in a few moments',
    ],
  },
  [ERROR_TYPES.INVALID_RESPONSE]: {
    title: 'Invalid Response',
    message: 'Received an unexpected response from the server. Please try again.',
    suggestions: [
      'Refresh the page',
      'Clear browser cache',
      'Try again later',
    ],
  },
  [ERROR_TYPES.API_ERROR]: {
    title: 'Service Error',
    message: 'The mapping service encountered an error. Please try again later.',
    suggestions: [
      'Try a different route',
      'Check if locations are accessible',
      'Wait a moment and retry',
    ],
  },
  [ERROR_TYPES.VALIDATION_ERROR]: {
    title: 'Invalid Input',
    message: 'Please check your inputs and ensure all required fields are filled correctly.',
    suggestions: [
      'Fill all required fields',
      'Check for valid addresses',
      'Ensure start and end locations are different',
    ],
  },
  [ERROR_TYPES.UNKNOWN]: {
    title: 'Something Went Wrong',
    message: 'An unexpected error occurred. Please try again.',
    suggestions: [
      'Refresh the page',
      'Try again in a moment',
      'Contact support if the problem persists',
    ],
  },
};

/**
 * Classify error and return type
 */
export const classifyError = (error) => {
  // Network errors
  if (!error) return ERROR_TYPES.UNKNOWN;
  
  if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
    return ERROR_TYPES.NETWORK_ERROR;
  }
  
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return ERROR_TYPES.TIMEOUT;
  }
  
  // API/Response errors
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;
    
    // 404 or no results found
    if (status === 404 || 
        data?.detail?.includes('No route') ||
        data?.detail?.includes('not found') ||
        data?.results?.length === 0) {
      return ERROR_TYPES.ADDRESS_NOT_FOUND;
    }
    
    // 400 validation errors
    if (status === 400) {
      return ERROR_TYPES.VALIDATION_ERROR;
    }
    
    // 500+ server errors
    if (status >= 500) {
      return ERROR_TYPES.API_ERROR;
    }
  }
  
  // Invalid response format
  if (error.message?.includes('JSON') || 
      error.message?.includes('Unexpected token')) {
    return ERROR_TYPES.INVALID_RESPONSE;
  }
  
  return ERROR_TYPES.UNKNOWN;
};

/**
 * Get user-friendly error information
 */
export const getErrorInfo = (error) => {
  const errorType = classifyError(error);
  const errorInfo = ERROR_MESSAGES[errorType];
  
  return {
    type: errorType,
    ...errorInfo,
    originalError: error,
  };
};

/**
 * Format error for display
 */
export const formatErrorMessage = (error) => {
  const info = getErrorInfo(error);
  
  return {
    title: info.title,
    message: info.message,
    suggestions: info.suggestions,
    type: info.type,
  };
};

/**
 * Log error with context
 */
export const logError = (error, context = {}) => {
  const errorInfo = getErrorInfo(error);
  
  console.error('Error occurred:', {
    type: errorInfo.type,
    title: errorInfo.title,
    message: errorInfo.message,
    context,
    originalError: error,
    timestamp: new Date().toISOString(),
  });
};
