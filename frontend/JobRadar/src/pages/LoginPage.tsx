import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden font-sans text-slate-200">
      
      {/* ── LỚP NỀN CỐ ĐỊNH (FIXED BACKGROUND) ── */}
      {/* Đây là phần quan trọng nhất để không bao giờ có khoảng trắng khi zoom */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 10% 10%, #0f2340 0%, #060e1a 55%, #07111f 100%)",
        }}
      />
      
      {/* Hiệu ứng Vignette phía dưới */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(15,35,70,0.35) 0%, transparent 70%)",
        }}
      />

      {/* ── NỘI DUNG CHÍNH (CONTENT LAYER) ── */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* NAVBAR */}
        <header className="flex items-center justify-center h-14 shrink-0 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="9" stroke="#94a3b8" strokeWidth="1.4" />
              <circle cx="11" cy="11" r="2.5" fill="#94a3b8" />
              <line x1="11" y1="2" x2="11" y2="4.5" stroke="#94a3b8" strokeWidth="1.4" strokeLinecap="round" />
              <line x1="11" y1="17.5" x2="11" y2="20" stroke="#94a3b8" strokeWidth="1.4" strokeLinecap="round" />
              <line x1="2" y1="11" x2="4.5" y2="11" stroke="#94a3b8" strokeWidth="1.4" strokeLinecap="round" />
              <line x1="17.5" y1="11" x2="20" y2="11" stroke="#94a3b8" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <span className="font-semibold text-[15px] tracking-tight text-slate-100">JobRadar</span>
          </div>
        </header>

        {/* MAIN FORM */}
        <main className="flex-grow flex items-center justify-center px-4 py-12">
          <Card
            className="w-full max-w-[430px] border-white/10 bg-slate-950/40 backdrop-blur-2xl"
            style={{
              borderRadius: "14px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
            }}
          >
            <CardHeader className="text-center pt-9 pb-5 px-8">
              <CardTitle className="text-[22px] font-semibold tracking-tight text-white">Welcome back</CardTitle>
              <CardDescription className="text-[14px] text-slate-400 mt-1">Sign in to track your engineering career</CardDescription>
            </CardHeader>

            <CardContent className="px-8 pb-9 grid gap-5">
              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  className="h-11 bg-white/5 border-white/10 text-sm text-slate-200 placeholder:text-slate-600 focus-visible:ring-1 focus-visible:ring-blue-500/60"
                />
              </div>

              {/* Password */}
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Password</Label>
                  <a href="#" className="text-[13px] text-slate-400 hover:text-slate-200 transition-colors">Forgot password?</a>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    defaultValue="password123"
                    className="h-11 bg-white/5 border-white/10 text-sm text-slate-200 pr-10 focus-visible:ring-1 focus-visible:ring-blue-500/60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? "🙈" : "👁️"} {/* Thay bằng Lucide Eye nếu thích */}
                  </button>
                </div>
              </div>

              <Button className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white font-semibold gap-2 mt-1 transition-all active:scale-[0.98]">
                Sign In <LogIn className="h-4 w-4" />
              </Button>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5" /></div>
                <div className="relative flex justify-center">
                  <span className="bg-[#0b1424] px-4 text-[11px] font-medium uppercase tracking-widest text-slate-500">Or continue with</span>
                </div>
              </div>

              <Button variant="outline" className="h-11 bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white">
                Google
              </Button>
              
              <p className="text-center text-[13px] text-slate-400 mt-2">
                Don't have an account? <a href="#" className="font-semibold text-white hover:text-blue-400 transition-colors">Request Access</a>
              </p>
            </CardContent>
          </Card>
        </main>

        {/* FOOTER */}
        <footer className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 py-6 text-[11px] text-slate-500 shrink-0">
          <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
          <span>© 2024 JobRadar. All rights reserved.</span>
        </footer>
      </div>

      {/* Decorative Card - Giữ ở Absolute để không ảnh hưởng layout chính */}
      <div
        className="hidden md:block pointer-events-none absolute bottom-8 right-8 w-64 h-32 rounded-xl z-0"
        style={{
          border: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.015)",
        }}
      />
    </div>
  );
}