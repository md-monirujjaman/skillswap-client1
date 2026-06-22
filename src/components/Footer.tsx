import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-10 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <Link to="/" className="font-semibold text-xl tracking-tight text-black dark:text-white flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center rounded-lg font-bold">
              S
            </div>
            <span>SkillSwap</span>
          </Link>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mb-4">
            The premier freelance micro-task platform. Connect with experts, get work done, or earn from your skills.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-gray-400 hover:text-black dark:hover:text-white transition-colors">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"></path>
              </svg>
            </a>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Navigation</h4>
          <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <li><Link to="/" className="hover:text-black dark:hover:text-white transition-colors">Home</Link></li>
            <li><Link to="/tasks" className="hover:text-black dark:hover:text-white transition-colors">Browse Tasks</Link></li>
            <li><Link to="/freelancers" className="hover:text-black dark:hover:text-white transition-colors">Browse Freelancers</Link></li>
            <li><Link to="/login" className="hover:text-black dark:hover:text-white transition-colors">Login</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Contact Info</h4>
          <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <li>Email: support@skillswap.com</li>
            <li>Phone: +1 (555) 123-4567</li>
            <li>New York, NY, USA</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 md:px-8 mt-10 pt-6 border-t border-gray-100 dark:border-gray-800 text-center text-sm text-gray-400 dark:text-gray-500 transition-colors">
        <p>&copy; {new Date().getFullYear()} SkillSwap Marketplace. All rights reserved.</p>
      </div>
    </footer>
  );
}
