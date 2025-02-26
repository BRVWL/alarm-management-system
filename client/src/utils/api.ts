import { Configuration } from '../api';

// Token storage functions
export const getToken = (): string | null => {
  return localStorage.getItem('cogvis_token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('cogvis_token', token);
};

export const removeToken = (): void => {
  localStorage.removeItem('cogvis_token');
};

// Create API configuration with authentication token
export const createApiConfig = () => {
  const token = getToken();
  return new Configuration({
    basePath: 'http://localhost:3000',
    accessToken: token || undefined,
  });
};

// Get the full URL for a visualization image
export const getVisualizationUrl = (path: string): string => {
  const baseUrl = 'http://localhost:3000';
  
  // If the path already starts with http, return it as is
  if (path.startsWith('http')) {
    return path;
  }
  
  // If the path already includes the base URL, return it as is
  if (path.includes(baseUrl)) {
    return path;
  }
  
  // Ensure path starts with a single slash
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // Return the combined URL without double slashes
  return `${baseUrl}${normalizedPath}`;
}; 