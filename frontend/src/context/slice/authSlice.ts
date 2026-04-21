// authSlice.ts
import authQuery from "@/api/auth.query";
import axiosInstance from "@/api/axiosInstance";
import { StateCreator } from "zustand";

export type User = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
};

export type AuthSlice = {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;

    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
    logout: () => void;

    fetchMe: () => Promise<void>;
};

export const authSlice: StateCreator<AuthSlice> = (set) => ({
    user: null,
    loading: true,
    isAuthenticated: false,

    setUser: (user) =>
        set({
            user,
            isAuthenticated: !!user,
            loading: false,
        }),

    setLoading: (loading) => set({ loading }),

    logout: async () => {
        try {
            set({ loading: true });

            const res = await authQuery.logout();

            if (res.status !== 200) throw new Error("Failed to logout");

            set({
                user: null,
                isAuthenticated: false,
                loading: false,
            });

        } catch (error) {
            set({
                user: null,
                isAuthenticated: false,
                loading: false,
            });
        }
    },

    fetchMe: async () => {
        try {
            set({ loading: true });

            const res = await axiosInstance.get("/auth/me", {
                withCredentials: true,
            });

            if (res.status !== 200) throw new Error("Unauthorized");

            const data = res.data;

            set({
                user: data,
                isAuthenticated: true,
                loading: false,
            });
        } catch {
            set({
                user: null,
                isAuthenticated: false,
                loading: false,
            });
        }
    },
});