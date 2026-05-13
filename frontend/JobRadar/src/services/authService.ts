import api from "../lib/axios";
import type { User } from "../types/user";

type ApiResponse<T> = {
    success?: boolean;
    data?: T;
};

const unwrapData = <T>(responseData: T | ApiResponse<T>): T => {
    if (
        responseData &&
        typeof responseData === "object" &&
        "data" in responseData
    ) {
        return (responseData as ApiResponse<T>).data as T;
    }

    return responseData as T;
};

export const authService = {
    signUp: async (email: string, password: string, name: string) => {
        const response = await api.post("/auth/register", { email, password, name }, { withCredentials: true});
        return response.data;
    },
    signIn: async (email: string, password: string) => {
        const response = await api.post("/auth/login", { email, password}, { withCredentials: true});
        return response.data;
    },
    fetchMe: async () => {
        const response = await api.get("/users/me", { withCredentials: true });
        return unwrapData<User>(response.data);
    },
    signOut: async () => {
        return api.post("/auth/logout", {}, { withCredentials: true }); 
    },
    refreshToken: async () => {
        const response = await api.post('/auth/refresh',{}, { withCredentials: true });
        return response.data;
    }
}
