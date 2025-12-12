import { useState } from 'react';
import AuthService, { LoginPayload } from '../../api/AuthService';

export const useCompanyLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (formData: LoginPayload) => {
    setIsLoading(true);
    setError(null);

    try {
      await AuthService.loginCompany(formData);
      // Handle success (e.g., redirect, store token)
      console.log("Login successful");
    } catch (err) {
      setError("Failed to login. Please check your credentials.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading,
    error,
  };
};
