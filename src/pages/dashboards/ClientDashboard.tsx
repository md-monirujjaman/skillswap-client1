import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";

// Sub-pages (We will stub these first, and add data fetching)
import PostTask from "./client/PostTask";
import MyTasks from "./client/MyTasks";
import ManageProposals from "./client/ManageProposals";

export default function ClientDashboard() {
  const links = [
    { path: "/dashboard/client", label: "Overview" },
    { path: "/dashboard/client/post", label: "Post a Task" },
    { path: "/dashboard/client/tasks", label: "My Tasks" }
  ];

  return (
    <DashboardLayout roleLinks={links}>
      <Routes>
        <Route path="/" element={<ClientOverview />} />
        <Route path="/post" element={<PostTask />} />
        <Route path="/tasks" element={<MyTasks />} />
        <Route path="/tasks/:taskId/proposals" element={<ManageProposals />} />
      </Routes>
    </DashboardLayout>
  );
}

// Inline Overview Component
import { useEffect, useState } from "react";
import axios from "axios";

function ClientOverview() {
  const [stats, setStats] = useState({ totalTasks: 0, openTasks: 0, inProgressTasks: 0, totalSpent: 0 });

  useEffect(() => {
    axios.get("/api/dashboard/client").then(res => setStats(res.data.stats)).catch(console.error);
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Client Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Tasks</div>
          <div className="text-2xl font-bold">{stats.totalTasks}</div>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Open Tasks</div>
          <div className="text-2xl font-bold">{stats.openTasks}</div>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">In Progress</div>
          <div className="text-2xl font-bold">{stats.inProgressTasks}</div>
        </div>
        <div className="p-4 bg-black dark:bg-white text-white dark:text-black rounded-lg border border-gray-800 dark:border-gray-200 text-center">
          <div className="text-sm text-gray-400 dark:text-gray-500 mb-1">Total Spent (USD)</div>
          <div className="text-2xl font-bold">${stats.totalSpent}</div>
        </div>
      </div>
    </div>
  );
}
