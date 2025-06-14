export interface PublishOptions {
  timeout?: number;
  retries?: number;
  persistent?: boolean;
  priority?: number;
  expiration?: string;
  headers?: Record<string, any>;
}