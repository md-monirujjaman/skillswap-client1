import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white/85 dark:bg-[#111726]/85 backdrop-blur-md border-b border-gray-100 dark:border-[#1e293b]/60 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 text-white flex items-center justify-center rounded-lg font-bold shadow-sm shadow-indigo-500/20">
                S
              </div>
              <span className="font-bold tracking-tight text-xl text-gray-900 dark:text-white transition-colors">SkillSwap</span>
            </Link>
          </div>
          
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            <Link to="/" className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition">Home</Link>
            <Link to="/tasks" className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition">Browse Tasks</Link>
            <Link to="/freelancers" className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition">Browse Freelancers</Link>
            
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>
            
            <button onClick={toggleTheme} className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white p-2 rounded-md transition">
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {user ? (
              <>
                <Link to={`/dashboard/${user.role.toLowerCase()}`} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition">Dashboard</Link>
                {user.role === 'Freelancer' && (
                  <Link to={`/freelancers/${user.id}`} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition">Profile</Link>
                )}
                <button onClick={handleLogout} className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm shadow-indigo-500/10">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm shadow-indigo-500/10">
                Login
              </Link>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button onClick={toggleTheme} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white p-2 rounded-md transition mr-2">
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white p-2 rounded-md transition">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-850">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-center">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Home</Link>
            <Link to="/tasks" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Browse Tasks</Link>
            <Link to="/freelancers" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Browse Freelancers</Link>
            {user ? (
              <>
                <Link to={`/dashboard/${user.role.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Dashboard</Link>
                {user.role === 'Freelancer' && <Link to={`/freelancers/${user.id}`} onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Profile</Link>}
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="w-full mt-2 bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-lg text-base font-medium">Logout</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block mt-2 bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-lg text-base font-medium">Login</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
