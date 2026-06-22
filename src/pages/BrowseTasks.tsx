import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Task } from "../types";
import { Search } from "lucide-react";

export default function BrowseTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination and Filtering State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/tasks?page=${page}&limit=9&search=${search}&category=${category}`);
      setTasks(res.data.tasks);
      setTotalPages(res.data.pages);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [page, search, category]);

  // Reset page when filter changes
  useEffect(() => {
    setPage(1);
  }, [search, category]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Browse Open Tasks</h1>
          <p className="text-gray-500 mt-1">Find the perfect job for your skills.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-4 md:mt-0">
          <div className="relative">
             <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
             <input 
               type="text" 
               placeholder="Search by title..." 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-700 bg-transparent rounded-md focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white outline-none w-full sm:w-64"
             />
          </div>
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 bg-transparent rounded-md focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white outline-none w-full sm:w-48 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          >
            <option value="" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">All Categories</option>
            <option value="Design" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">Design</option>
            <option value="Writing" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">Writing</option>
            <option value="Development" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">Development</option>
            <option value="Marketing" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">Marketing</option>
            <option value="Other" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">Other</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-500">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="py-20 text-center text-gray-500 border border-dashed rounded-xl border-gray-300">
          No tasks found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <Link to={`/tasks/${task._id}`} key={task._id} className="group block h-full">
              <div className="bg-white dark:bg-gray-900 border text-left border-gray-200 dark:border-gray-800 rounded-xl p-6 h-full flex flex-col hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-800 text-xs font-medium rounded-full text-gray-800 dark:text-gray-200">
                    {task.category}
                  </span>
                  <span className="font-semibold text-lg text-green-600">${task.budget}</span>
                </div>
                <h3 className="text-xl font-medium tracking-tight mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                  {task.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-4 flex-1">
                  {task.description}
                </p>
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mt-auto">
                  <span>Client: {task.client_name || task.client_email}</span>
                  <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-12">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed group transition-colors"
          >
            Previous
          </button>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Page {page} of {totalPages}
          </span>
          <button 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
