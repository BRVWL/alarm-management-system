import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Configuration, AuthApi, LoginDto } from '../api';
import { useNavigate } from 'react-router-dom';

// Define types for our context
interface User {
  id: string;
  username: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

// Create the context with default values
export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => {},
  logout: () => {},
  loading: false,
  error: null,
});

interface AuthProviderProps {
  children: ReactNode;
}

// Token storage functions
const getToken = (): string | null => {
  return localStorage.getItem('cogvis_token');
};

const setToken = (token: string): void => {
  localStorage.setItem('cogvis_token', token);
};

const removeToken = (): void => {
  localStorage.removeItem('cogvis_token');
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Initialize auth state from storage
  useEffect(() => {
    const token = getToken();
    if (token) {
      setIsAuthenticated(true);
      // Fetch user profile
      const config = new Configuration({
        basePath: 'http://localhost:3000',
        accessToken: token,
      });
      const authApi = new AuthApi(config);
      
      authApi.authControllerGetProfile()
        .then(response => {
          setUser(response.data);
        })
        .catch(() => {
          // Token invalid
          removeToken();
          setIsAuthenticated(false);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const authApi = new AuthApi(new Configuration({
        basePath: 'http://localhost:3000',
      }));
      
      const loginDto: LoginDto = { username, password };
      const response = await authApi.authControllerLogin(loginDto);
      
      const { accessToken } = response.data;
      
      setToken(accessToken);
      
      // Fetch user profile after login
      const config = new Configuration({
        basePath: 'http://localhost:3000',
        accessToken: accessToken,
      });
      
      const profileApi = new AuthApi(config);
      const profileResponse = await profileApi.authControllerGetProfile();
      
      setUser(profileResponse.data);
      setIsAuthenticated(true);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid username or password');
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 