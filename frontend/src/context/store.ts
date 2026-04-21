// store.ts
import { create } from "zustand";
import { authSlice, AuthSlice } from "./slice/authSlice";

export type StoreState = AuthSlice;

export const useStore = create<StoreState>()((...a) => ({
    ...authSlice(...a),
}));