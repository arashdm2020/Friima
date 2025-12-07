import { useState, useEffect } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { api } from '@/lib/api';
import { wsClient } from '@/lib/websocket';

export function useAuth() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load user from token if available
    const token = localStorage.getItem('jwt_token');
    if (token && isConnected) {
      loadUser();
    }
  }, [isConnected]);

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

  const login = async () => {
    if (!address) {
      setError('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. Get nonce
      const { nonce } = await api.getNonce(address);

      // 2. Sign message
      const message = `Sign this message to authenticate with FARIIMA.\n\nNonce: ${nonce}`;
      const signature = await signMessageAsync({ message });

      // 3. Login
      const { token, user: userData } = await api.login(address, signature, nonce);
      
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
    logout,
  };
}
