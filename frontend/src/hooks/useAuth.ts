import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { wsClient } from '@/lib/websocket';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load user from token if available
    const token = localStorage.getItem('jwt_token');
    if (token) {
      loadUser();
    }
  }, []);

  const loadUser = async () => {
    try {
      const userData = await api.getCurrentUser();
      setUser(userData);
      
      // Connect WebSocket
      if (userData.id) {
        wsClient.connect(userData.id);
      }
    } catch (err) {
      console.error('Failed to load user:', err);
      api.clearToken();
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { token, user: userData } = await api.login(email, password);
      
      setUser(userData);
      
      // Connect WebSocket
      if (userData.id) {
        wsClient.connect(userData.id);
      }
      
      return userData;
    } catch (err: any) {
      setError(err.message || 'Failed to login');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, userData: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await api.register(email, password, userData);
      
      setUser(result.user);
      
      // Connect WebSocket
      if (result.user.id) {
        wsClient.connect(result.user.id);
      }
      
      return result.user;
    } catch (err: any) {
      setError(err.message || 'Failed to register');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithLinkedIn = async (code: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { token, user: userData } = await api.loginWithLinkedIn(code);
      
      setUser(userData);
      
      // Connect WebSocket
      if (userData.id) {
        wsClient.connect(userData.id);
      }
      
      return userData;
    } catch (err: any) {
      setError(err.message || 'Failed to login with LinkedIn');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    api.clearToken();
    setUser(null);
    wsClient.disconnect();
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    loginWithLinkedIn,
    logout,
  };
}
