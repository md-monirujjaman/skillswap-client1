import { useEffect, useState } from "react";
import axios from "axios";
import { Star } from "lucide-react";

export default function ActiveProjects() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [deliverableUrl, setDeliverableUrl] = useState("");

  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [revieweeEmail, setRevieweeEmail] = useState("");

  useEffect(() => {
    axios.get("/api/tasks/assigned").then(res => {
      setTasks(res.data);
      setLoading(false);
    }).catch(console.error);
  }, []);

  const openModal = (id: string) => {
    setActiveTaskId(id);
    setIsModalOpen(true);
    setDeliverableUrl("");
  };

  const openReviewModal = (taskId: string, clientEmail: string) => {
    setActiveTaskId(taskId);
    setRevieweeEmail(clientEmail);
    setReviewRating(5);
    setReviewComment("");
    setIsReviewOpen(true);
  };

  const handleSubmitDeliverable = async () => {
    if (!deliverableUrl || !activeTaskId) return;
    try {
      await axios.post(`/api/actions/tasks/${activeTaskId}/deliver`, { deliverable_url: deliverableUrl });
      setTasks(prev => prev.map(t => t._id === activeTaskId ? { ...t, status: 'Completed', deliverable_url: deliverableUrl } : t));
      setIsModalOpen(false);
    } catch (e) {
      alert("Error submitting deliverable.");
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewComment || !activeTaskId) return;
    try {
      await axios.post(`/api/actions/tasks/${activeTaskId}/review`, { 
        reviewee_email: revieweeEmail,
        rating: reviewRating,
        comment: reviewComment 
      });
      alert("Review submitted successfully!");
      setIsReviewOpen(false);
    } catch (e: any) {
      alert(e.response?.data?.error || "Error submitting review.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Active & Completed Projects</h2>
      {tasks.length === 0 ? (
        <div className="text-gray-500 py-10 border border-dashed dark:border-gray-800 rounded-lg text-center">No active projects right now.</div>
      ) : (
        <div className="space-y-4">
          {tasks.map(task => (
            <div key={task._id} className="p-5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{task.title}</h3>
                <div className="text-sm text-gray-500 dark:text-gray-400">Client: {task.client_email} • Status: <span className="font-medium text-black dark:text-white">{task.status}</span></div>
                {task.deliverable_url && (
                   <div className="text-sm mt-2 text-blue-600 dark:text-blue-400 font-medium"><a href={task.deliverable_url} target="_blank" rel="noreferrer" className="hover:underline">View Deliverable</a></div>
                )}
              </div>
              <div className="flex gap-2">
                {task.status === 'In Progress' && (
                  <button onClick={() => openModal(task._id)} className="bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200">
                    Submit Deliverable
                  </button>
                )}
                {task.status === 'Completed' && (
                  <div className="flex gap-2">
                    <span className="px-4 py-2 bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800 rounded-md text-sm font-medium">Completed</span>
                    <button onClick={() => openReviewModal(task._id, task.client_email)} className="bg-yellow-50 text-yellow-700 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-105 dark:hover:bg-yellow-900/50 transition">
                      Review Client
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-50 p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Submit Deliverable</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 font-medium">Provide a link to your completed work (e.g., Google Docs, GitHub, Figma, Dropbox).</p>
            <input 
              type="url" 
              placeholder="https://..." 
              value={deliverableUrl}
              onChange={(e) => setDeliverableUrl(e.target.value)}
              className="w-full px-4 py-2 bg-transparent text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-md focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white outline-none mb-6"
            />
            <div className="flex justify-end gap-3 text-sm font-medium">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmitDeliverable}
                disabled={!deliverableUrl}
                className="bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition disabled:opacity-50"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {isReviewOpen && (
        <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-50 p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Rate the Client</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 font-medium">How was your experience working with this client?</p>
            
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                 <button key={star} onClick={() => setReviewRating(star)} className="focus:outline-none">
                    <Star className={`w-8 h-8 ${reviewRating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-700'}`} />
                 </button>
              ))}
            </div>

            <textarea 
              rows={4}
              placeholder="Leave a comment about your experience..." 
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              className="w-full px-4 py-2 bg-transparent text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-md focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white outline-none mb-6 resize-none"
            />
            <div className="flex justify-end gap-3 text-sm font-medium">
              <button 
                onClick={() => setIsReviewOpen(false)}
                className="px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmitReview}
                disabled={!reviewComment}
                className="bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition disabled:opacity-50"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
