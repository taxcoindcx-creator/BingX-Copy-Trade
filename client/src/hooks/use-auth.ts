import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useLocation } from "wouter";

export function useAuth() {
  const [_, setLocation] = useLocation();

  const loginMutation = useMutation({
    mutationFn: async (password: string) => {
      try {
        const res = await fetch(api.auth.login.path, {
          method: api.auth.login.method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        });

        const data = await res.json().catch(() => ({}));
        
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error(data.message || "Incorrect password");
          }
          throw new Error(data.message || `Login failed (${res.status})`);
        }

        return api.auth.login.responses[200].parse(data);
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message) {
          throw error;
        }
        throw new Error("Network error - please check your connection");
      }
    },
    onSuccess: (data) => {
      if (data.success) {
        setLocation("/home");
      }
    },
  });

  return {
    login: loginMutation.mutate,
    isPending: loginMutation.isPending,
    error: loginMutation.error,
  };
}
