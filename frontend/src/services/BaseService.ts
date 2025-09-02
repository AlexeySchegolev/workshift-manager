import { HttpClient } from '../api/http-client';
import HttpClientManager from '../api/HttpClientManager';

/**
 * Base service class that provides centralized API configuration
 * Uses a shared HTTP client instance to ensure authentication tokens
 * are properly propagated across all services
 */
export class BaseService {
  private httpClientManager: HttpClientManager;
  
  constructor() {
    this.httpClientManager = HttpClientManager.getInstance();
  }
  
  /**
   * Get the shared HTTP client instance
   */
  protected getHttpClient(): HttpClient {
    return this.httpClientManager.getHttpClient();
  }
}