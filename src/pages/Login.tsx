import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { ArrowRight, Briefcase } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post("/api/auth/login", { email, password });
      await checkAuth(); // Refresh user state
      
      const res = await axios.get("/api/auth/me");
      const r = res.data.user.role;
      if (r === 'Admin') navigate("/dashboard/admin");
      else if (r === 'Client') navigate("/");
      else navigate("/dashboard/freelancer");

    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      await axios.post("/api/auth/google");
      await checkAuth(); // Refresh user state
      navigate("/"); // Google users are Client by default, so go to Home
    } catch (err: any) {
      setError(err.response?.data?.error || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center px-4 bg-[#fcfcfd] dark:bg-[#080d19] select-none relative overflow-auto py-12">
      {/* Soft orange decorative glow in background */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-amber-500/5 to-orange-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[420px] z-10 flex flex-col">
        {/* Brand Logo & Name */}
        <div className="flex items-center justify-center gap-2.5 mb-6">
          <div className="w-[42px] h-[42px] bg-[#f27a00] text-white flex items-center justify-center rounded-2xl shadow-lg shadow-orange-500/20">
            <Briefcase className="w-5.5 h-5.5 stroke-[2.2] text-white" />
          </div>
          <span className="text-2xl font-black tracking-tight text-[#f27a00]">
            TaskHive
          </span>
        </div>

        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight mb-2">
            Welcome back
          </h1>
          <p className="text-[#71717a] dark:text-[#a1a1aa] text-sm">
            Sign in to your TaskHive account
          </p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-rose-950/20 text-red-600 dark:text-rose-450 rounded-2xl text-sm border border-red-100 dark:border-rose-900/30 font-medium text-center shadow-sm">
            {error}
          </div>
        )}

        {/* Google Continue Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-[#f4f4f5] hover:bg-[#e4e4e7] dark:bg-slate-800/60 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-200 rounded-2xl text-[14px] font-semibold transition cursor-pointer active:scale-[0.99]"
        >
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider lines */}
        <div className="relative my-7 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#e4e4e7] dark:border-slate-800"></div>
          </div>
          <span className="relative bg-[#fcfcfd] dark:bg-[#080d19] px-4 text-[12px] text-[#a1a1aa] dark:text-[#71717a] font-normal">
            or continue with email
          </span>
        </div>

        {/* Sign In Form block */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[13px] font-semibold text-[#71717a] dark:text-[#a1a1aa] mb-2">
              Email
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3.5 bg-[#f4f4f5] dark:bg-slate-800/40 text-gray-900 dark:text-gray-100 rounded-2xl focus:bg-white dark:focus:bg-[#0e1626] focus:ring-1 focus:ring-[#f27a00] outline-none transition text-[14.5px] placeholder-gray-400 border border-transparent dark:border-transparent dark:placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-[#71717a] dark:text-[#a1a1aa] mb-2">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3.5 bg-[#f4f4f5] dark:bg-slate-800/40 text-gray-900 dark:text-gray-100 rounded-2xl focus:bg-white dark:focus:bg-[#0e1626] focus:ring-1 focus:ring-[#f27a00] outline-none transition text-[14.5px] placeholder-gray-400 border border-transparent dark:border-transparent dark:placeholder-gray-500"
            />
          </div>

          {/* Action orange button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 mt-8 bg-[#f27a00] hover:bg-[#e06c00] text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-orange-500/15 hover:shadow-orange-500/25 transition duration-150 transform active:scale-[0.98] cursor-pointer text-[14.5px] disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
            <ArrowRight className="w-4.5 h-4.5" />
          </button>
        </form>

        {/* Bottom redirect link */}
        <div className="mt-8 text-center text-sm text-[#71717a] dark:text-[#a1a1aa]">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-[#f27a00] hover:text-[#e06c00] font-bold transition ml-1"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
