import { HttpClient } from '../api/http-client';

/**
 * Base service class that provides centralized API configuration
 * Uses environment variable VITE_API_URL for base URL configuration
 */
export class BaseService {
  protected httpClient: HttpClient;
  
  constructor() {
    const baseURL = import.meta.env.VITE_API_URL;
    
    this.httpClient = new HttpClient({
      baseURL: baseURL,
    });
  }
  
  /**
   * Get the configured HTTP client instance
   */
  protected getHttpClient(): HttpClient {
    return this.httpClient;
  }
}