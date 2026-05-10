import api from "../lib/axios";

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
        return response.data;
    },
    signOut: async () => {
        return api.post("/auth/logout", {}, { withCredentials: true }); 
    },
    refreshToken: async () => {
        const response = await api.post('/auth/refresh',{}, { withCredentials: true });
        return response.data;
    }
}