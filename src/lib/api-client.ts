interface ApiClientConfig {
  baseURL: string;
  getAccessToken?: () => string | null;
  onUnauthorized?: () => void;
}

/**
 * Centralized API client with automatic token refresh on 401
 */
export class ApiClient {
  private baseURL: string;
  private getAccessToken: () => string | null;
  private onUnauthorized?: () => void;
  private isRefreshing = false;
  private refreshPromise: Promise<void> | null = null;

  constructor(config: ApiClientConfig) {
    this.baseURL = config.baseURL;
    this.getAccessToken = config.getAccessToken || (() => null);
    this.onUnauthorized = config.onUnauthorized;
  }

  private async refreshAccessToken(): Promise<void> {
    // If already refreshing, wait for the existing promise
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = (async () => {
      try {
        const refreshToken = typeof window !== 'undefined' 
          ? localStorage.getItem('refresh_token')
          : null;
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Get the accounts API endpoint for refresh
        const { getApiEndpoint } = await import('./config');
        const refreshUrl = getApiEndpoint('/accounts/refresh/');
        
        const response = await fetch(refreshUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh: refreshToken }),
        });

        if (!response.ok) {
          throw new Error('Failed to refresh token');
        }

        const data = await response.json();
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', data.access);
          if (data.refresh) {
            localStorage.setItem('refresh_token', data.refresh);
          }
        }
        
        console.log('Token refreshed successfully');
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {},
    skipAuth: boolean = false
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available and not skipping auth
    if (!skipAuth) {
      const token = this.getAccessToken();
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
    }

    try {
      const response = await fetch(url, config);
      
      // Handle 401 with automatic token refresh
      if (response.status === 401 && !skipAuth) {
        console.log('Received 401, attempting to refresh token...');
        
        try {
          await this.refreshAccessToken();
          
          // Retry the request with the new token
          const newToken = this.getAccessToken();
          if (newToken) {
            config.headers = {
              ...config.headers,
              Authorization: `Bearer ${newToken}`,
            };
          }
          
          const retryResponse = await fetch(url, config);
          
          // Verificar se a resposta tem conteúdo antes de tentar parsear JSON
          if (retryResponse.status === 204 || retryResponse.status === 205) {
            if (!retryResponse.ok) {
              throw new Error(`Erro HTTP: ${retryResponse.status} ${retryResponse.statusText}`);
            }
            return null as T;
          }

          // Ler o texto da resposta (só pode ser lido uma vez)
          const retryText = await retryResponse.text();
          
          if (!retryResponse.ok) {
            // Tentar parsear como JSON se houver conteúdo
            if (retryText && retryText.trim().length > 0) {
              try {
                const errorData = JSON.parse(retryText);
                throw new Error(errorData.detail || errorData.error || 'Ocorreu um erro.');
              } catch (parseError) {
                // Se não for JSON válido, usar o texto como erro
                throw new Error(retryText || `Erro HTTP: ${retryResponse.status} ${retryResponse.statusText}`);
              }
            } else {
              throw new Error(`Erro HTTP: ${retryResponse.status} ${retryResponse.statusText}`);
            }
          }

          // Se não há conteúdo, retornar null
          if (!retryText || retryText.trim().length === 0) {
            return null as T;
          }

          // Verificar Content-Type para saber se é JSON
          const retryContentType = retryResponse.headers.get('content-type');
          const retryIsJson = retryContentType && retryContentType.includes('application/json');
          
          // Tentar parsear como JSON se o Content-Type indicar JSON
          if (retryIsJson) {
            try {
              return JSON.parse(retryText) as T;
            } catch (parseError) {
              console.error('Failed to parse JSON response:', parseError);
              throw new Error('Resposta inválida do servidor');
            }
          }

          // Se não for JSON, retornar o texto como string
          return retryText as T;
        } catch (refreshError) {
          console.error('Failed to refresh token:', refreshError);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
          }
          
          if (this.onUnauthorized) {
            this.onUnauthorized();
          } else if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          
          throw new Error('Sessão expirada. Por favor, faça login novamente.');
        }
      }
      
      // Verificar se a resposta tem conteúdo antes de tentar parsear JSON
      // Respostas 204 No Content e 205 Reset Content não têm corpo
      if (response.status === 204 || response.status === 205) {
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status} ${response.statusText}`);
        }
        return null as T;
      }

      // Ler o texto da resposta (só pode ser lido uma vez)
      const text = await response.text();
      
      if (!response.ok) {
        // Tentar parsear como JSON se houver conteúdo
        if (text && text.trim().length > 0) {
          try {
            const errorData = JSON.parse(text);
            throw new Error(errorData.detail || errorData.error || errorData.message || 'Ocorreu um erro.');
          } catch (parseError) {
            // Se não for JSON válido, usar o texto como erro
            throw new Error(text || `Erro HTTP: ${response.status} ${response.statusText}`);
          }
        } else {
          throw new Error(`Erro HTTP: ${response.status} ${response.statusText}`);
        }
      }

      // Se não há conteúdo, retornar null
      if (!text || text.trim().length === 0) {
        return null as T;
      }

      // Verificar Content-Type para saber se é JSON
      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');
      
      // Tentar parsear como JSON se o Content-Type indicar JSON
      if (isJson) {
        try {
          return JSON.parse(text) as T;
        } catch (parseError) {
          console.error('Failed to parse JSON response:', parseError);
          throw new Error('Resposta inválida do servidor');
        }
      }

      // Se não for JSON, retornar o texto como string
      return text as T;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }
}