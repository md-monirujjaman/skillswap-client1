import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Proposal } from "../../../types";

export default function ManageProposals() {
  const { taskId } = useParams();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchProps = async () => {
      try {
        const res = await axios.get(`/api/proposals/task/${taskId}`);
        setProposals(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProps();
  }, [taskId]);

  const handleAccept = async (proposalId: string) => {
    setProcessing(true);
    try {
      const res = await axios.post("/api/payment/create-checkout-session", { proposalId });
      window.location.href = res.data.url; // Redirect to Stripe
    } catch (e: any) {
      alert(e.response?.data?.error || "Error accepting proposal");
      setProcessing(false);
    }
  };

  const handleReject = async (proposalId: string) => {
    if(!confirm("Reject this proposal?")) return;
    try {
      await axios.post(`/api/proposals/${proposalId}/reject`);
      setProposals(prev => prev.map(p => p._id === proposalId ? { ...p, status: 'Rejected' } : p));
    } catch (e) {
      alert("Error.");
    }
  };

  if (loading) return <div>Loading proposals...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Review Proposals</h2>
      {proposals.length === 0 ? (
        <div className="text-gray-500 py-10 border border-dashed dark:border-gray-800 rounded-lg text-center">No proposals received yet.</div>
      ) : (
        <div className="space-y-4">
          {proposals.map(p => (
            <div key={p._id} className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 relative">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{p.freelancer_email.split('@')[0]} <span className="text-sm font-normal text-gray-500">({p.freelancer_email})</span></h3>
                  <div className="text-sm text-gray-500 mt-1">Bid: <span className="font-medium text-black dark:text-white">${p.proposed_budget}</span> in {p.estimated_days} days</div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  p.status === 'Accepted' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' :
                  p.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800' :
                  'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800'
                }`}>
                  {p.status}
                </div>
              </div>
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-md text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                "{p.cover_note}"
              </div>
              {p.status === 'Pending' && (
                <div className="flex gap-3">
                  <button onClick={() => handleAccept(p._id)} disabled={processing} className="bg-black text-white dark:bg-white dark:text-black px-5 py-2 rounded-md text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50">Accept & Hire</button>
                  <button onClick={() => handleReject(p._id)} disabled={processing} className="bg-white border border-gray-300 text-black dark:bg-gray-900 dark:border-gray-700 dark:text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800">Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
