import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Task } from "../../../types";

export default function MyTasks() {
  const [tasks, setTasks] = useState<(Task & { freelancer_email?: string })[]>([]);
  const [loading, setLoading] = useState(true);

  // Review Modal State
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [activeReviewTask, setActiveReviewTask] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [activeEditTask, setActiveEditTask] = useState<any>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("Design");
  const [editDescription, setEditDescription] = useState("");
  const [editBudget, setEditBudget] = useState("");
  const [editDeadline, setEditDeadline] = useState("");

  const fetchIt = async () => {
    try {
      const res = await axios.get("/api/tasks/manage");
      setTasks(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIt();
  }, []);

  const handleDelete = async (id: string, status: string) => {
    if (status !== 'Open') {
      alert("Can only delete open tasks.");
      return;
    }
    if(confirm("Delete this task?")) {
      try {
        await axios.delete(`/api/tasks/${id}`);
        setTasks(prev => prev.filter(t => t._id !== id));
      } catch (e: any) {
        alert(e.response?.data?.error || "Error deleting task");
      }
    }
  };

  const openReviewModal = (task: any) => {
    setActiveReviewTask(task);
    setRating(5);
    setComment("");
    setIsReviewOpen(true);
  };

  const submitReview = async () => {
    if (!activeReviewTask) return;
    try {
      await axios.post(`/api/actions/tasks/${activeReviewTask._id}/review`, {
        reviewee_email: activeReviewTask.freelancer_email,
        rating,
        comment
      });
      alert("Review submitted!");
      setIsReviewOpen(false);
      setActiveReviewTask(null);
    } catch (e: any) {
      alert(e.response?.data?.error || "Failed to submit review");
    }
  };

  const openEditModal = (task: any) => {
    setActiveEditTask(task);
    setEditTitle(task.title);
    setEditCategory(task.category);
    setEditDescription(task.description);
    setEditBudget(task.budget.toString());
    setEditDeadline(task.deadline.split('T')[0]); // Formats Date to YYYY-MM-DD
    setIsEditOpen(true);
  };

  const submitEdit = async () => {
    if (!activeEditTask) return;
    try {
      await axios.put(`/api/tasks/${activeEditTask._id}`, {
        title: editTitle,
        category: editCategory,
        description: editDescription,
        budget: Number(editBudget),
        deadline: editDeadline
      });
      // Update local state without fetching again
      setTasks(prev => prev.map(t => t._id === activeEditTask._id ? {
        ...t,
        title: editTitle,
        category: editCategory,
        description: editDescription,
        budget: Number(editBudget),
        deadline: editDeadline
      } : t));
      setIsEditOpen(false);
      setActiveEditTask(null);
    } catch (e: any) {
      alert(e.response?.data?.error || "Failed to edit task");
    }
  };

  if (loading) return <div>Loading your tasks...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Manage My Tasks</h2>
      {tasks.length === 0 ? (
        <div className="text-gray-500 py-10 border border-dashed rounded-lg text-center">You haven't posted any tasks yet.</div>
      ) : (
        <div className="space-y-4">
          {tasks.map(task => (
            <div key={task._id} className="p-5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{task.title}</h3>
                <div className="text-sm text-gray-500 dark:text-gray-400">Status: <span className="font-medium text-black dark:text-white">{task.status}</span> • Budget: ${task.budget}</div>
                {task.status === 'Completed' && task.deliverable_url && (
                  <div className="mt-2 text-sm">
                    <span className="font-medium text-gray-900 dark:text-white">Deliverable: </span>
                    <a href={task.deliverable_url} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                      View Work
                    </a>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2 text-sm font-medium">
                <Link to={`/dashboard/client/tasks/${task._id}/proposals`} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md text-gray-700 dark:text-gray-200">View Proposals</Link>
                {task.status === 'Open' && (
                  <>
                    <button onClick={() => openEditModal(task)} className="px-4 py-2 text-blue-600 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-md">Edit</button>
                    <button onClick={() => handleDelete(task._id, task.status)} className="px-4 py-2 text-red-600 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md">Delete</button>
                  </>
                )}
                {task.status === 'Completed' && (
                  <button onClick={() => openReviewModal(task)} className="px-4 py-2 text-white bg-black dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 rounded-md">Leave Review</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {isReviewOpen && activeReviewTask && (
        <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-50 p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-md p-6 border border-gray-200 dark:border-gray-800">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Rate & Review Freelancer</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium">Leave a review for their work on "{activeReviewTask.title}".</p>
            
            <div className="mb-4">
               <label className="block text-sm font-medium mb-1 text-gray-750 dark:text-gray-300">Rating (Out of 5)</label>
               <input 
                 type="number" 
                 min="1" max="5" 
                 value={rating} 
                 onChange={e => setRating(Number(e.target.value))}
                 className="w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-transparent text-gray-900 dark:text-white"
               />
            </div>
            
            <div className="mb-6">
               <label className="block text-sm font-medium mb-1 text-gray-750 dark:text-gray-300">Comment</label>
               <textarea 
                 rows={3}
                 value={comment} 
                 onChange={e => setComment(e.target.value)}
                 className="w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-transparent text-gray-900 dark:text-white resize-none"
                 placeholder="How was the quality of work?"
               ></textarea>
            </div>

            <div className="flex justify-end gap-3 text-sm font-medium">
               <button onClick={() => setIsReviewOpen(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-200">Cancel</button>
               <button onClick={submitReview} className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-100">Submit Review</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditOpen && activeEditTask && (
        <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-50 p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-lg p-6 border border-gray-200 dark:border-gray-800">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Edit Task</h3>
            <div className="space-y-4 mb-6 text-sm">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-750 dark:text-gray-300">Title</label>
                <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} className="w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-transparent text-gray-900 dark:text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-750 dark:text-gray-300">Category</label>
                  <select value={editCategory} onChange={e => setEditCategory(e.target.value)} className="w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                    <option className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">Design</option>
                    <option className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">Writing</option>
                    <option className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">Development</option>
                    <option className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">Marketing</option>
                    <option className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-750 dark:text-gray-300">Budget (USD)</label>
                  <input type="number" min="1" value={editBudget} onChange={e => setEditBudget(e.target.value)} className="w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-transparent text-gray-900 dark:text-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-750 dark:text-gray-300">Deadline Date</label>
                <input type="date" value={editDeadline} onChange={e => setEditDeadline(e.target.value)} className="w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-transparent text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-750 dark:text-gray-300">Description</label>
                <textarea rows={4} value={editDescription} onChange={e => setEditDescription(e.target.value)} className="w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-transparent text-gray-900 dark:text-white resize-none"></textarea>
              </div>
            </div>

            <div className="flex justify-end gap-3 text-sm font-medium">
               <button onClick={() => setIsEditOpen(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-200">Cancel</button>
               <button onClick={submitEdit} className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-200">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
