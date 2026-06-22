import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Task } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { Bookmark } from "lucide-react";

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Proposal State
  const [budget, setBudget] = useState("");
  const [days, setDays] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [proposalFlash, setProposalFlash] = useState("");

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await axios.get(`/api/tasks/${id}`);
        setTask(res.data);
      } catch (e: any) {
        setError(e.response?.data?.error || "Task not found");
      } finally {
        setLoading(false);
      }
    };
    fetchTask();

    if (user?.role === 'Freelancer') {
      axios.get('/api/users/bookmarks').then(res => {
         const bookmarks = res.data;
         if (bookmarks.some((t: any) => t._id === id || t === id)) {
           setIsBookmarked(true);
         }
      }).catch(console.error);
    }
  }, [id, user]);

  const handleBookmark = async () => {
    try {
      const res = await axios.post(`/api/users/bookmark/${id}`);
      setIsBookmarked(res.data.bookmarked);
    } catch (e) {
      alert("Failed to bookmark task");
    }
  };

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return navigate("/login");
    
    setSubmitting(true);
    setProposalFlash("");

    try {
      await axios.post("/api/proposals", {
        task_id: id,
        proposed_budget: Number(budget),
        estimated_days: Number(days),
        cover_note: note
      });
      setProposalFlash("Proposal submitted successfully!");
      setBudget(""); setDays(""); setNote("");
    } catch (e: any) {
      setProposalFlash(e.response?.data?.error || "Failed. You might have already applied.");
    } finally {
       setSubmitting(false);
    }
  };

  if (loading) return <div className="py-20 text-center">Loading task details...</div>;
  if (error || !task) return <div className="py-20 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
      {/* Task Info Sidebar */}
      <div className="flex-1">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-xs font-medium rounded-full text-gray-800 dark:text-gray-200">{task.category}</span>
              <span className={`px-3 py-1 text-xs font-medium rounded-full border ${
                task.status === 'Open' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' :
                task.status === 'In Progress' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800' :
                'bg-gray-100 dark:bg-gray-850 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-850'
              }`}>
                {task.status}
              </span>
            </div>
            {user?.role === 'Freelancer' && (
              <button 
                onClick={handleBookmark} 
                className={`p-2 rounded-full transition ${isBookmarked ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                title="Bookmark Task"
              >
                <Bookmark className="w-5 h-5" fill={isBookmarked ? "currentColor" : "none"} />
              </button>
            )}
          </div>

          <h1 className="text-3xl font-bold tracking-tight mb-4 text-gray-900 dark:text-white">{task.title}</h1>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-8 py-6 border-y border-gray-100 dark:border-gray-800">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Budget Setup</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">${task.budget}</p>
            </div>
            <div>
               <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Deadline Date</p>
               <p className="text-base font-medium text-gray-900 dark:text-white">{new Date(task.deadline).toLocaleDateString()}</p>
            </div>
            <div>
               <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Posted By</p>
               <p className="text-base font-medium text-gray-900 dark:text-white truncate" title={task.client_email}>{task.client_email.split('@')[0]}</p>
            </div>
          </div>

          <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Project Details</h3>
            {task.description}
          </div>
        </div>
      </div>

      {/* Application Form */}
      <div className="w-full md:w-80">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 sticky top-24">
          <h2 className="text-xl font-semibold mb-6">Submit a Proposal</h2>
          
          {proposalFlash && (
            <div className={`mb-4 p-3 rounded-md text-sm ${proposalFlash.includes('success') ? 'bg-green-50 text-green-700 border border-green-100 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' : 'bg-red-50 text-red-600 border border-red-100 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'}`}>
              {proposalFlash}
            </div>
          )}

          {user?.role === 'Client' || user?.role === 'Admin' ? (
             <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm text-center border border-gray-200 dark:border-gray-700">
               Only Freelancers can submit proposals.
             </div>
          ) : task.status !== 'Open' ? (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm text-center border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">
               This task is no longer accepting proposals.
            </div>
          ) : (
            <form onSubmit={handleSubmitProposal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">My Bid (USD)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input type="number" required min="1" max="100000" disabled={submitting}
                         value={budget} onChange={e => setBudget(e.target.value)}
                         className="w-full pl-8 pr-4 py-2 bg-transparent border border-gray-300 dark:border-gray-700 rounded-md focus:ring-black focus:border-black dark:focus:ring-white dark:focus:border-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estimated Days</label>
                <input type="number" required min="1" max="365" disabled={submitting}
                       value={days} onChange={e => setDays(e.target.value)}
                       className="w-full px-4 py-2 bg-transparent border border-gray-300 dark:border-gray-700 rounded-md focus:ring-black focus:border-black dark:focus:ring-white dark:focus:border-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cover Note Message</label>
                <textarea required rows={4} disabled={submitting}
                          value={note} onChange={e => setNote(e.target.value)}
                          placeholder="Why are you a good fit?"
                          className="w-full px-4 py-2 bg-transparent border border-gray-300 dark:border-gray-700 rounded-md focus:ring-black focus:border-black dark:focus:ring-white dark:focus:border-white resize-none" />
              </div>
              <button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-black text-white dark:bg-white dark:text-black py-3 rounded-md font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition disabled:opacity-50"
              >
                {submitting ? "Submitting..." : user ? "Apply Now" : "Login to Apply"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
