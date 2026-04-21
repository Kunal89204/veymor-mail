import { useStore } from "@/context/store";

export const useAuth = () => {
  const user = useStore((state) => state.user);
  const loading = useStore((state) => state.loading);
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const logout = useStore((state) => state.logout);
  const fetchMe = useStore((state) => state.fetchMe);
  const setUser = useStore((state) => state.setUser);

  return {
    user,
    loading,
    isAuthenticated,
    logout,
    fetchMe,
    setUser,
  };
};