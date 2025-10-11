/**
 * Configurações centralizadas da aplicação
 * Centraliza todas as configurações de ambiente e URLs da API
 */

export interface AppConfig {
  apiUrl: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

class ConfigService {
  private config: AppConfig;

  constructor() {
    this.config = {
      apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
      isDevelopment: process.env.NODE_ENV === 'development',
      isProduction: process.env.NODE_ENV === 'production',
    };
  }

  /**
   * Retorna a URL base da API
   */
  getApiUrl(): string {
    return this.config.apiUrl;
  }

  /**
   * Retorna a URL completa para um endpoint específico
   * @param endpoint - O endpoint da API (ex: '/audio', '/accounts')
   */
  getApiEndpoint(endpoint: string): string {
    const baseUrl = this.config.apiUrl.replace(/\/$/, ''); // Remove trailing slash
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${baseUrl}${cleanEndpoint}`;
  }

  /**
   * Verifica se está em ambiente de desenvolvimento
   */
  isDevelopment(): boolean {
    return this.config.isDevelopment;
  }

  /**
   * Verifica se está em ambiente de produção
   */
  isProduction(): boolean {
    return this.config.isProduction;
  }

  /**
   * Retorna todas as configurações
   */
  getAllConfig(): AppConfig {
    return { ...this.config };
  }

  /**
   * Atualiza uma configuração específica (útil para testes)
   * @param key - A chave da configuração
   * @param value - O novo valor
   */
  updateConfig<K extends keyof AppConfig>(key: K, value: AppConfig[K]): void {
    this.config[key] = value;
  }
}

// Instância singleton do serviço de configuração
export const configService = new ConfigService();

// Exporta também as funções individuais para facilitar o uso
export const getApiUrl = () => configService.getApiUrl();
export const getApiEndpoint = (endpoint: string) => configService.getApiEndpoint(endpoint);
export const isDevelopment = () => configService.isDevelopment();
export const isProduction = () => configService.isProduction();
