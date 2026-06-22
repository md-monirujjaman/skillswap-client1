// This matches the challenge structural rules for dashboards.
import React, { useState } from "react";
import { NavLink, Routes, Route } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Menu, X } from "lucide-react";

export default function DashboardLayout({ children, roleLinks }: { children: React.ReactNode, roleLinks: {path: string, label: string}[] }) {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  if (!user) return null;

  return (
    <div className="flex flex-col md:flex-row gap-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden min-h-[600px] relative">
      
      {/* Mobile Toggle Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center gap-3">
          <img src={user.image || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} alt="avatar" className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700" />
          <span className="font-semibold">{user.name}</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 bg-gray-200 dark:bg-gray-700 rounded-md">
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`w-full md:w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6 flex flex-col ${mobileMenuOpen ? 'flex' : 'hidden md:flex'}`}>
        <div className="hidden md:block mb-8">
           <img src={user.image || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} alt="avatar" className="w-16 h-16 rounded-full border border-gray-200 dark:border-gray-700 mb-3" />
           <h3 className="font-semibold text-lg">{user.name}</h3>
           <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{user.role} Account</p>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          {roleLinks.map(link => (
            <NavLink 
              key={link.path}
              to={link.path}
              end
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `px-4 py-2 rounded-md font-medium text-sm transition-colors ${isActive ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-black dark:hover:text-white'}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 p-6 md:p-8 overflow-y-auto">
        {children}
      </div>

    </div>
  );
}
