import { BaseService } from './BaseService';
import { Authentication } from '../api/Authentication';
import {
  LoginDto,
  RegisterDto,
  AuthResponseDto,
  RegisterResponseDto,
  AuthUserDto
} from '../api/data-contracts';

/**
 * Service class for authentication operations
 * Handles login, registration, token management, and user session
 */
export class AuthService extends BaseService {
  private authApi: Authentication;

  constructor() {
    super();
    this.authApi = new Authentication(this.getHttpClient());
    
    // Initialize token from storage if available
    this.initializeToken();
  }

  /**
   * Initialize token from localStorage and set in axios headers
   */
  private initializeToken(): void {
    const token = this.getStoredToken();
    if (token && this.isTokenValid(token)) {
      this.setAuthToken(token);
    } else {
      this.clearAuthToken();
    }
  }

  /**
   * User login
   */
  async login(credentials: LoginDto): Promise<AuthResponseDto> {
    try {
      const response = await this.authApi.authControllerLogin(credentials);
      const authData = response.data;
      
      // Store token and set in axios headers
      this.setAuthToken(authData.access_token);
      
      return authData;
    } catch (error) {
      // Clear any existing token on login failure
      this.clearAuthToken();
      throw error;
    }
  }

  /**
   * User registration
   */
  async register(userData: RegisterDto): Promise<RegisterResponseDto> {
    const response = await this.authApi.authControllerRegister(userData);
    return response.data;
  }

  /**
   * User logout
   */
  async logout(): Promise<void> {
    try {
      // Call logout endpoint if token exists
      if (this.getStoredToken()) {
        await this.authApi.authControllerLogout();
      }
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error);
    } finally {
      // Always clear token locally
      this.clearAuthToken();
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<AuthUserDto> {
    const response = await this.authApi.authControllerGetProfile();
    return response.data;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getStoredToken();
    return !!(token && this.isTokenValid(token));
  }

  /**
   * Get stored JWT token
   */
  getStoredToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Set auth token in storage and axios headers
   */
  private setAuthToken(token: string): void {
    localStorage.setItem('auth_token', token);
    this.getHttpClient().instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Clear auth token from storage and axios headers
   */
  private clearAuthToken(): void {
    localStorage.removeItem('auth_token');
    delete this.getHttpClient().instance.defaults.headers.common['Authorization'];
  }

  /**
   * Check if JWT token is valid (not expired)
   */
  private isTokenValid(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch (error) {
      console.warn('Invalid JWT token:', error);
      return false;
    }
  }

  /**
   * Get user information from JWT token without API call
   */
  getUserFromToken(): { id: string; email: string; role: string; organizationIds: string[] } | null {
    const token = this.getStoredToken();
    if (!token || !this.isTokenValid(token)) {
      return null;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        organizationIds: payload.organizationIds || [],
      };
    } catch (error) {
      console.warn('Failed to decode JWT token:', error);
      return null;
    }
  }

  /**
   * Check if token will expire within specified minutes
   */
  isTokenExpiringSoon(minutesThreshold: number = 5): boolean {
    const token = this.getStoredToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      const expirationTime = payload.exp;
      const timeUntilExpiration = expirationTime - currentTime;
      
      return timeUntilExpiration <= (minutesThreshold * 60);
    } catch (error) {
      return true; // Consider expired if we can't decode
    }
  }
}