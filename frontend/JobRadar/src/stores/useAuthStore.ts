import { create } from 'zustand'
import { toast } from 'sonner'
import { persist } from 'zustand/middleware'
import type { AuthState } from '../types/store'
import { authService } from '../services/authService';
import type { User } from '../types/user';

type UserResponse = {
    success?: boolean;
    data?: User;
};

const normalizeUser = (user: User | UserResponse | null | undefined): User | null => {
    if (!user) return null;

    if ("data" in user && user.data) {
        return user.data;
    }

    return user as User;
};

export const useAuthStore = create<AuthState>()(
    persist((set, get) => ({
        accessToken: null,
        user: null,
        loading: false,

        setAccessToken: (token) => {
            set({ accessToken: token })
        },
        setUser: (user) => {
            set({ user: normalizeUser(user) })
        },
        cleanState: () => {
            set({ accessToken: null, user: null, loading: false });
            localStorage.clear();
            sessionStorage.clear();
        },
        signUp: async (email, password, name) => {
            try {
                get().cleanState();
                set({ loading: true });
                const response = await authService.signUp(email, password, name);
                if (response.user) {
                    toast.success("Đăng ký thành công!");
                }
            } catch (error) {
                console.error("Sign Up Error:", error);
                toast.error("Đăng ký thất bại!");
            } finally {
                set({ loading: false });
            }
        },
        signIn: async (email, password) => {
            try {
                set({ loading: true });
                const { accessToken } = await authService.signIn(email, password);
                if (accessToken) {
                    get().setAccessToken(accessToken);
                    await get().fetchMe();
                    toast.success("Đăng nhập thành công!");
                }else{
                    toast.error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.")
                }
            } catch (error) {
                console.error("Sign in error:", error);
                toast.error("Đăng nhập thất bại. Vui lòng thử lại.")
                throw error; 
            } finally {
                set({ loading: false });
            }
        },
        signOut: async () => {
            try {
                get().cleanState();
                await authService.signOut();
                toast.success("Đăng xuất thành công!");
            } catch (error) {
                console.error("Sign out error:", error);
                toast.error("Đăng xuất thất bại. Vui lòng thử lại.")
            }
        },
        fetchMe: async () => {
            try {
                const user = await authService.fetchMe();
                set({ user: normalizeUser(user) });
            } catch (error) {
                console.error("Fetch me error:", error);
                set({ user: null, accessToken: null });
                toast.error("Không thể lấy thông tin người dùng.")
            } finally {
                set({ loading: false });
            }
        },
        refreshToken: async () => {
            try {
                const { user, fetchMe, setAccessToken } = get();
                const accessToken = await authService.refreshToken();
                setAccessToken(accessToken);
                if (!user) {
                    await fetchMe();
                }
            } catch (error) {
                console.error("Refresh token error:", error);
                toast.error("Phiên đã hết hạn. Vui lòng đăng nhập lại.");
                get().cleanState();
            } finally {
                set({ loading: false });
            }
        },
    }), {
        name: 'auth-storage',
        partialize: (state) => ({ user: state.user }),
        merge: (persistedState, currentState) => {
            const persistedAuthState = persistedState as Partial<AuthState>;

            return {
                ...currentState,
                ...persistedAuthState,
                user: normalizeUser(persistedAuthState.user),
            };
        },
    })
);
