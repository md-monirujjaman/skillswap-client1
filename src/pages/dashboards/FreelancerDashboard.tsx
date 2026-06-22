import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";

import MyProposals from "./freelancer/MyProposals";
import ActiveProjects from "./freelancer/ActiveProjects";
import BookmarkedTasks from "./freelancer/BookmarkedTasks";
import EditProfile from "./freelancer/EditProfile";
import { useEffect, useState } from "react";
import axios from "axios";

export default function FreelancerDashboard() {
  const links = [
    { path: "/dashboard/freelancer", label: "Earnings" },
    { path: "/dashboard/freelancer/proposals", label: "My Proposals" },
    { path: "/dashboard/freelancer/projects", label: "Active Projects" },
    { path: "/dashboard/freelancer/bookmarks", label: "Saved Jobs" },
    { path: "/dashboard/freelancer/profile", label: "Edit Profile" }
  ];

  return (
    <DashboardLayout roleLinks={links}>
      <Routes>
        <Route path="/" element={<FreelancerOverview />} />
        <Route path="/proposals" element={<MyProposals />} />
        <Route path="/projects" element={<ActiveProjects />} />
        <Route path="/bookmarks" element={<BookmarkedTasks />} />
        <Route path="/profile" element={<EditProfile />} />
      </Routes>
    </DashboardLayout>
  );
}

function FreelancerOverview() {
  const [stats, setStats] = useState({ totalProposals: 0, pendingProposals: 0, acceptedProposals: 0, totalEarnings: 0 });
  const [earnings, setEarnings] = useState<any[]>([]);

  useEffect(() => {
    axios.get("/api/dashboard/freelancer").then(res => setStats(res.data.stats)).catch(console.error);
    axios.get("/api/dashboard/freelancer/earnings").then(res => setEarnings(res.data.earnings)).catch(console.error);
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Earnings & Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Proposals</div>
          <div className="text-2xl font-bold">{stats.totalProposals}</div>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Pending</div>
          <div className="text-2xl font-bold">{stats.pendingProposals}</div>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Hired</div>
          <div className="text-2xl font-bold">{stats.acceptedProposals}</div>
        </div>
        <div className="p-4 bg-black dark:bg-white text-white dark:text-black rounded-lg border border-gray-800 dark:border-gray-200 text-center">
          <div className="text-sm text-gray-400 dark:text-gray-500 mb-1">Total Earnings</div>
          <div className="text-2xl font-bold">${stats.totalEarnings}</div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Earnings History</h2>
      {earnings.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-gray-500">
          No earnings yet. Complete jobs to start earning.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="p-4 font-medium text-gray-600 dark:text-gray-400">Task Title</th>
                <th className="p-4 font-medium text-gray-600 dark:text-gray-400">Client</th>
                <th className="p-4 font-medium text-gray-600 dark:text-gray-400">Amount Made</th>
                <th className="p-4 font-medium text-gray-600 dark:text-gray-400">Date Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
              {earnings.map((payment: any) => (
                <tr key={payment._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="p-4 font-medium">{payment.task_title}</td>
                  <td className="p-4">{payment.client_name}</td>
                  <td className="p-4 text-green-600 font-semibold">${payment.amount}</td>
                  <td className="p-4 text-gray-500">{new Date(payment.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
