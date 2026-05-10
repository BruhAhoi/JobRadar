
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { UserPlus, Info, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "../stores/useAuthStore";
import { useNavigate } from 'react-router'

// Định nghĩa Schema xác thực bằng Zod
const registerSchema = z
  .object({
    displayName: z.string().min(2, "Tên hiển thị phải ít nhất 2 ký tự."),
    email: z.string().email("Địa chỉ email không hợp lệ."),
    password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự."),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp.",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { signUp } = useAuthStore();
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    console.log("Dữ liệu đăng ký:", data);
    // Thực hiện gọi API đăng ký tại đây
    const { email, password, displayName} = data;

    await signUp(email, password, displayName);
    navigate("/login");
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden font-sans text-slate-200">
      {/* Background lớp nền cố định */}
      <div
        className="fixed inset-0 z-0"
        style={{ background: "radial-gradient(ellipse 80% 60% at 10% 10%, #0f2340 0%, #060e1a 55%, #07111f 100%)" }}
      />

      <div className="relative z-10 flex flex-col min-h-screen w-full">
        {/* ── NAVBAR ── */}
        <header className="flex items-center justify-center h-14 shrink-0 border-b border-white/5">
          <div className="flex items-center justify-center h-full w-full px-6">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full border border-slate-400 flex items-center justify-center">
                <div className="w-1 h-1 bg-slate-400 rounded-full" />
              </div>
              <span className="font-bold text-slate-100 tracking-tight">JobRadar</span>
            </div>
          </div>
        </header>

        {/* ── MAIN CONTENT ── */}
        <main className="grow flex flex-col items-center justify-center px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white tracking-tight">Create account</h1>
            <p className="text-slate-400 mt-2">Start tracking your engineering career</p>
          </div>

          <Card className="w-full max-w-105 border-white/10 bg-slate-900/40 backdrop-blur-2xl shadow-2xl overflow-hidden">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

                {/* Full Name */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="displayName" className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                    Full Name
                  </Label>
                  <Input
                    id="displayName"
                    placeholder="John Doe"
                    {...register("displayName")}
                    className="bg-white/5 border-white/10 h-11 focus:ring-blue-500/50"
                  />
                  {errors.displayName && (
                    <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                      <Info size={12} /> {errors.displayName.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email" className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    {...register("email")}
                    className="bg-white/5 border-white/10 h-11"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                      <Info size={12} /> {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="password" className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPw ? "text" : "password"}
                      placeholder="••••••••"
                      {...register("password")}
                      className="bg-white/5 border-white/10 h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                      <Info size={12} /> {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="confirmPassword" className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      placeholder="••••••••"
                      {...register("confirmPassword")}
                      className="bg-white/5 border-white/10 h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                      <Info size={12} /> {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white font-semibold gap-2 mt-2 transition-all active:scale-[0.98]"
                >
                  {isSubmitting ? "Creating..." : "Create Account"}
                  {!isSubmitting && <UserPlus size={18} />}
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="mt-8 text-sm text-slate-400">
            Already have an account?{" "}
            <a href="/login" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
              Sign In
            </a>
          </p>
        </main>

        {/* ── FOOTER ── */}
        <footer className="py-6 text-center text-[11px] text-slate-600 shrink-0">
          © 2024 JobRadar. All rights reserved.
        </footer>
      </div>
    </div>
  );
}