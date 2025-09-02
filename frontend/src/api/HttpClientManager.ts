import { HttpClient } from './http-client';

/**
 * Singleton HTTP client manager that ensures all services share the same
 * authenticated HTTP client instance. This resolves the issue where each
 * service creates its own HTTP client, causing authentication tokens
 * to not be shared between services.
 */
class HttpClientManager {
  private static instance: HttpClientManager;
  private httpClient: HttpClient;

  private constructor() {
    const baseURL = import.meta.env.VITE_API_URL;
    
    this.httpClient = new HttpClient({
      baseURL: baseURL,
    });
  }

  /**
   * Get the singleton instance of HttpClientManager
   */
  public static getInstance(): HttpClientManager {
    if (!HttpClientManager.instance) {
      HttpClientManager.instance = new HttpClientManager();
    }
    return HttpClientManager.instance;
  }

  /**
   * Get the shared HTTP client instance
   */
  public getHttpClient(): HttpClient {
    return this.httpClient;
  }

  /**
   * Set authentication token on the shared HTTP client
   * This will affect all services using this shared client
   */
  public setAuthToken(token: string): void {
    this.httpClient.instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Clear authentication token from the shared HTTP client
   */
  public clearAuthToken(): void {
    delete this.httpClient.instance.defaults.headers.common['Authorization'];
  }

  /**
   * Check if authentication token is currently set
   */
  public hasAuthToken(): boolean {
    return !!this.httpClient.instance.defaults.headers.common['Authorization'];
  }
}

export default HttpClientManager;