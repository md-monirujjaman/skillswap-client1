import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { ArrowRight, Briefcase, User as UserIcon, Code2, Sparkles } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const [role, setRole] = useState("Client");
  
  // Custom Freelancer fields
  const [skills, setSkills] = useState("");
  const [bio, setBio] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  const validatePassword = (pass: string) => {
    if (pass.length < 6) return "Password must be at least 6 characters long.";
    if (!/[A-Z]/.test(pass)) return "Password must contain at least one uppercase letter.";
    if (!/[a-z]/.test(pass)) return "Password must contain at least one lowercase letter.";
    return null;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const passError = validatePassword(password);
    if (passError) {
      setError(passError);
      return;
    }

    setLoading(true);

    try {
      await axios.post("/api/auth/register", {
        name,
        email,
        password,
        image: image || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
        role,
        skills,
        bio,
        hourlyRate: hourlyRate ? Number(hourlyRate) : 50,
      });

      await checkAuth(); // Refresh user state
      
      if (role === 'Client') {
        navigate("/");
      } else {
        navigate("/dashboard/freelancer");
      }

    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      setLoading(true);
      setError("");
      await axios.post("/api/auth/google");
      await checkAuth(); 
      navigate("/"); 
    } catch (err: any) {
      setError(err.response?.data?.error || "Google registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center px-4 bg-[#fcfcfd] dark:bg-[#080d19] select-none relative overflow-auto py-12">
      {/* Decorative ambient background blur */}
      <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[750px] h-[750px] bg-gradient-to-tr from-amber-500/5 to-emerald-500/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="w-full max-w-[440px] z-10 flex flex-col">
        {/* Brand Header */}
        <div className="flex items-center justify-center gap-2.5 mb-6">
          <div className="w-[42px] h-[42px] bg-[#f27a00] text-white flex items-center justify-center rounded-2xl shadow-lg shadow-orange-500/20">
            <Briefcase className="w-5.5 h-5.5 stroke-[2.2] text-white" />
          </div>
          <span className="text-2xl font-black tracking-tight text-[#f27a00]">
            TaskHive
          </span>
        </div>

        {/* Headings */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight mb-2">
            Create your account
          </h1>
          <p className="text-[#71717a] dark:text-[#a1a1aa] text-sm">
            Join thousands of professionals on TaskHive
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/20 text-red-600 dark:text-rose-455 rounded-2xl text-sm border border-red-100 dark:border-rose-900/30 font-medium text-center shadow-sm">
            {error}
          </div>
        )}

        {/* Role Select Buttons Row - Same to Same Design with Image */}
        <div className="grid grid-cols-2 gap-4 w-full mb-6">
          {/* Client Selection Button */}
          <button
            type="button"
            onClick={() => setRole("Client")}
            className={`relative p-5 rounded-2xl text-left border transition-all duration-150 transform hover:scale-[1.01] active:scale-[0.99] flex flex-col items-center sm:items-start text-center sm:text-left cursor-pointer ${
              role === "Client"
                ? "border-[#f27a00] bg-[#fffbf7] dark:bg-amber-950/15 ring-2 ring-[#f27a00]/15"
                : "border-gray-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] hover:bg-gray-50/50 dark:hover:bg-slate-900"
            }`}
          >
            {role === "Client" && (
              <span className="absolute top-2 right-2 w-3 h-3 bg-[#f27a00] rounded-full ring-2 ring-white dark:ring-[#0f172a]" />
            )}
            <div className={`p-3 rounded-xl mb-3 flex items-center justify-center ${
              role === "Client" 
                ? "bg-[#ffe5cc] dark:bg-amber-900/30 text-[#f27a00]"
                : "bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-450"
            }`}>
              <UserIcon className="w-5.5 h-5.5 stroke-[2.2]" />
            </div>
            <h3 className={`font-bold text-sm ${role === "Client" ? "text-[#f27a00]" : "text-gray-805 dark:text-gray-300"}`}>
              Client
            </h3>
            <p className="text-[11px] text-[#71717a] dark:text-gray-400 mt-1">
              Hire talent
            </p>
          </button>

          {/* Freelancer Selection Button */}
          <button
            type="button"
            onClick={() => setRole("Freelancer")}
            className={`relative p-5 rounded-2xl text-left border transition-all duration-150 transform hover:scale-[1.01] active:scale-[0.99] flex flex-col items-center sm:items-start text-center sm:text-left cursor-pointer ${
              role === "Freelancer"
                ? "border-[#0bb489] bg-[#f4fbf9] dark:bg-emerald-950/15 ring-2 ring-[#0bb489]/15"
                : "border-gray-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] hover:bg-gray-50/50 dark:hover:bg-slate-900"
            }`}
          >
            {role === "Freelancer" && (
              <span className="absolute top-2 right-2 w-3 h-3 bg-[#0bb489] rounded-full ring-2 ring-white dark:ring-[#0f172a]" />
            )}
            <div className={`p-3 rounded-xl mb-3 flex items-center justify-center ${
              role === "Freelancer" 
                ? "bg-[#ccf2e8] dark:bg-emerald-900/30 text-[#0bb489]"
                : "bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-450"
            }`}>
              <Code2 className="w-5.5 h-5.5 stroke-[2.2]" />
            </div>
            <h3 className={`font-bold text-sm ${role === "Freelancer" ? "text-[#0bb489]" : "text-gray-805 dark:text-gray-300"}`}>
              Freelancer
            </h3>
            <p className="text-[11px] text-[#71717a] dark:text-gray-400 mt-1">
              Find work
            </p>
          </button>
        </div>

        {/* Continue with Google */}
        <button
          type="button"
          onClick={handleGoogleRegister}
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

        {/* Divider line */}
        <div className="relative my-7 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#e4e4e7] dark:border-slate-800"></div>
          </div>
          <span className="relative bg-[#fcfcfd] dark:bg-[#080d19] px-4 text-[12px] text-[#a1a1aa] dark:text-[#71717a] font-normal">
            or sign up with email
          </span>
        </div>

        {/* Email form layout */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-[13px] font-semibold text-[#71717a] dark:text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              required
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3.5 bg-[#f4f4f5] dark:bg-slate-800/40 text-gray-900 dark:text-gray-100 rounded-2xl focus:bg-white dark:focus:bg-[#0e1626] focus:ring-1 focus:ring-[#f27a00] outline-none transition text-[14.5px] placeholder-[#a1a1aa] border border-transparent dark:border-transparent"
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-[#71717a] dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3.5 bg-[#f4f4f5] dark:bg-slate-800/40 text-gray-900 dark:text-gray-100 rounded-2xl focus:bg-white dark:focus:bg-[#0e1626] focus:ring-1 focus:ring-[#f27a00] outline-none transition text-[14.5px] placeholder-[#a1a1aa] border border-transparent dark:border-transparent"
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-[#71717a] dark:text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3.5 bg-[#f4f4f5] dark:bg-slate-800/40 text-gray-900 dark:text-gray-100 rounded-2xl focus:bg-white dark:focus:bg-[#0e1626] focus:ring-1 focus:ring-[#f27a00] outline-none transition text-[14.5px] placeholder-[#a1a1aa] border border-transparent dark:border-transparent"
            />
            <p className="text-[10px] text-[#a1a1aa] mt-1.5 uppercase font-semibold tracking-wider">
              Requires: 6+ chars, 1 uppercase, 1 lowercase letter
            </p>
          </div>

          {/* Optional profile image input */}
          <div>
            <label className="block text-[13px] font-semibold text-[#71717a] dark:text-gray-300 mb-2">
              Profile Image URL (Optional)
            </label>
            <input
              type="url"
              placeholder="https://example.com/avatar.jpg"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-4 py-3.5 bg-[#f4f4f5] dark:bg-slate-800/40 text-gray-900 dark:text-gray-100 rounded-2xl focus:bg-white dark:focus:bg-[#0e1626] focus:ring-1 focus:ring-[#f27a00] outline-none transition text-[14.5px] placeholder-[#a1a1aa] border border-transparent dark:border-transparent"
            />
          </div>

          {/* Specialty Freelancer Profile Section styled perfectly to match Image 3 */}
          {role === "Freelancer" && (
            <div className="bg-[#f0fbf8] dark:bg-teal-950/15 border border-[#ccf2e8] dark:border-teal-900/40 rounded-2xl p-5 mt-6 space-y-4 text-left animate-fade-in transition-all">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-[#0bb489]" />
                <span className="text-[14px] font-bold text-[#0bb489]">
                  Freelancer Profile
                </span>
              </div>

              <div>
                <label className="block text-[11.5px] font-bold text-teal-800 dark:text-teal-400 mb-1.5 uppercase tracking-wider">
                  Skills <span className="text-[10px] font-normal text-teal-500 lowercase">(comma-separated)</span>
                </label>
                <input
                  type="text"
                  placeholder="React, Node.js, Design"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-[#0e1626] text-gray-900 dark:text-gray-100 border border-[#b2ebe0] dark:border-teal-900/50 rounded-xl focus:ring-1 focus:ring-[#0bb489] focus:border-[#0bb489] outline-none text-[13.5px]"
                />
              </div>

              <div>
                <label className="block text-[11.5px] font-bold text-teal-800 dark:text-teal-400 mb-1.5 uppercase tracking-wider">
                  Bio
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell clients about yourself..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-[#0e1626] text-gray-900 dark:text-gray-100 border border-[#b2ebe0] dark:border-teal-900/50 rounded-xl focus:ring-1 focus:ring-[#0bb489] focus:border-[#0bb489] outline-none text-[13.5px] resize-none"
                />
              </div>

              <div>
                <label className="block text-[11.5px] font-bold text-teal-800 dark:text-teal-400 mb-1.5 uppercase tracking-wider">
                  Hourly Rate (USD) <span className="text-[10px] font-normal text-teal-500 lowercase">optional</span>
                </label>
                <input
                  type="number"
                  placeholder="50"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-[#0e1626] text-gray-900 dark:text-gray-100 border border-[#b2ebe0] dark:border-teal-900/50 rounded-xl focus:ring-1 focus:ring-[#0bb489] focus:border-[#0bb489] outline-none text-[13.5px]"
                />
              </div>
            </div>
          )}

          {/* Create Account Submit Button - Always matches image accent */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 mt-8 bg-[#f27a00] hover:bg-[#e06c00] text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-orange-500/15 hover:shadow-orange-500/25 transition duration-150 transform active:scale-[0.98] cursor-pointer text-[14.5px] disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
            <ArrowRight className="w-4.5 h-4.5" />
          </button>
        </form>

        {/* Bottom login link */}
        <div className="mt-8 text-center text-sm text-[#71717a] dark:text-[#a1a1aa]">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#f27a00] hover:text-[#e06c00] font-bold transition ml-1"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
