import { useEffect, useState } from "react";
import axios from "axios";

export default function MyProposals() {
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/proposals/mine").then(res => {
      setProposals(res.data);
      setLoading(false);
    }).catch(console.error);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Proposals</h2>
      {proposals.length === 0 ? (
        <div className="text-gray-500 py-10 border border-dashed dark:border-gray-800 rounded-lg text-center">You haven't submitted any proposals yet.</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="p-3 text-sm font-medium text-gray-600 dark:text-gray-400">Task Title</th>
                <th className="p-3 text-sm font-medium text-gray-600 dark:text-gray-400">Budget Bid</th>
                <th className="p-3 text-sm font-medium text-gray-600 dark:text-gray-400">Date Sent</th>
                <th className="p-3 text-sm font-medium text-gray-600 dark:text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
              {proposals.map(p => (
                <tr key={p._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="p-3 text-sm font-medium">{p.task_id?.title || "Deleted Task"}</td>
                  <td className="p-3 text-sm">${p.proposed_budget}</td>
                  <td className="p-3 text-sm text-gray-500">{new Date(p.submitted_at).toLocaleDateString()}</td>
                  <td className="p-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                      p.status === 'Accepted' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' :
                      p.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800' :
                      'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
