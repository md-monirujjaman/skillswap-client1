import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function PostTask() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Design");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/tasks", {
        title, category, description, budget: Number(budget), deadline
      });
      navigate("/dashboard/client/tasks");
    } catch (e) {
      console.error(e);
      alert("Failed to post task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Post a New Task</h2>
      <form onSubmit={handlePost} className="max-w-2xl space-y-4 text-sm">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Task Title</label>
          <input required type="text" value={title} onChange={e=>setTitle(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-gray-105 rounded-md focus:ring-1 focus:ring-black dark:focus:ring-white outline-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Category</label>
            <select value={category} onChange={e=>setCategory(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-105 rounded-md focus:ring-1 focus:ring-black dark:focus:ring-white outline-none">
              <option className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">Design</option>
              <option className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">Writing</option>
              <option className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">Development</option>
              <option className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">Marketing</option>
              <option className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Budget (USD)</label>
            <input required type="number" min="1" value={budget} onChange={e=>setBudget(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-gray-105 rounded-md focus:ring-1 focus:ring-black dark:focus:ring-white outline-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Deadline Date</label>
          <input required type="date" value={deadline} onChange={e=>setDeadline(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-gray-105 rounded-md focus:ring-1 focus:ring-black dark:focus:ring-white outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Description</label>
          <textarea required rows={5} value={description} onChange={e=>setDescription(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-gray-105 rounded-md resize-none focus:ring-1 focus:ring-black dark:focus:ring-white outline-none" />
        </div>
        <button type="submit" disabled={loading} className="bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50">
          {loading ? "Posting..." : "Publish Task"}
        </button>
      </form>
    </div>
  );
}
