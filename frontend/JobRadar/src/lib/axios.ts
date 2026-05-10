import axios from 'axios';
import { useAuthStore } from '../stores/useAuthStore';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
})
//gán access token vào header của mỗi request
api.interceptors.request.use((config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});
// Auto-refresh khi access token hết hạn (401)
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // Skip retry cho các auth routes
    const skipUrls = ["/auth/login", "/auth/register", "/auth/refresh"];
    if (skipUrls.some((url) => originalRequest.url?.includes(url))) {
      return Promise.reject(error);
    }

    originalRequest._retryCount = originalRequest._retryCount || 0;

    if (error.response?.status === 401 && originalRequest._retryCount < 1) {
      originalRequest._retryCount += 1;
      try {
        const res = await api.post("/auth/refresh");
        const newToken = res.data.accessToken;
        useAuthStore.getState().setAccessToken(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch {
        useAuthStore.getState().cleanState();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;