import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const links = [
    { path: "/dashboard/admin", label: "Overview" },
    { path: "/dashboard/admin/users", label: "Manage Users" },
    { path: "/dashboard/admin/tasks", label: "Manage Tasks" },
    { path: "/dashboard/admin/transactions", label: "Transactions" }
  ];

  return (
    <DashboardLayout roleLinks={links}>
      <Routes>
        <Route path="/" element={<AdminOverview />} />
        <Route path="/users" element={<ManageUsers />} />
        <Route path="/tasks" element={<ManageTasks />} />
        <Route path="/transactions" element={<Transactions />} />
      </Routes>
    </DashboardLayout>
  );
}

function AdminOverview() {
  const [stats, setStats] = useState({ totalUsers: 0, totalTasks: 0, activeTasks: 0, totalRevenue: 0 });

  useEffect(() => {
    axios.get("/api/admin/stats").then(res => setStats(res.data)).catch(console.error);
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Admin Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-200">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1 font-medium">Total Users</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</div>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-200">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1 font-medium">Total Tasks</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalTasks}</div>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-200">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1 font-medium">Active Tasks</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeTasks}</div>
        </div>
        <div className="p-4 bg-black dark:bg-white text-white dark:text-black rounded-lg border border-gray-800 dark:border-gray-200 animate-in fade-in zoom-in-95 duration-200">
          <div className="text-sm text-gray-400 dark:text-gray-500 mb-1 font-medium">Platform Revenue</div>
          <div className="text-2xl font-bold">${stats.totalRevenue}</div>
        </div>
      </div>
    </div>
  );
}

function ManageUsers() {
  const [users, setUsers] = useState<any[]>([]);
  useEffect(() => { axios.get("/api/admin/users").then(res => setUsers(res.data)); }, []);

  const toggleBlock = async (id: string, currentStatus: boolean) => {
    try {
      await axios.patch(`/api/admin/users/${id}/block`, { isBlocked: !currentStatus });
      setUsers(users.map(u => u._id === id ? { ...u, isBlocked: !currentStatus } : u));
    } catch (e) { alert("Action failed"); }
  };

  const toggleVerify = async (id: string, currentStatus: boolean) => {
    try {
      await axios.patch(`/api/admin/users/${id}/verify`, { isVerified: !currentStatus });
      setUsers(users.map(u => u._id === id ? { ...u, isVerified: !currentStatus } : u));
    } catch (e) { alert("Action failed"); }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Manage Users</h2>
      <div className="overflow-x-auto border rounded-lg border-gray-200 dark:border-gray-800">
        <table className="w-full text-left bg-white dark:bg-gray-900">
          <thead className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">
            <tr><th className="p-3 text-sm font-semibold">Name</th><th className="p-3 text-sm font-semibold">Email</th><th className="p-3 text-sm font-semibold">Role</th><th className="p-3 text-sm font-semibold">Verified</th><th className="p-3 text-sm font-semibold">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
            {users.map(u => (
              <tr key={u._id} className="border-b border-gray-105 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="p-3 text-sm font-medium text-gray-900 dark:text-white">{u.name}</td>
                <td className="p-3 text-sm">{u.email}</td>
                <td className="p-3 text-sm">{u.role}</td>
                <td className="p-3 text-sm">
                  {u.role === 'Freelancer' && (
                    <button onClick={() => toggleVerify(u._id, u.isVerified)} className={`px-2 py-1 rounded text-xs font-semibold hover:opacity-90 transition ${u.isVerified ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' : 'bg-gray-105 text-gray-700 dark:bg-gray-800 dark:text-gray-400'}`}>
                      {u.isVerified ? 'Verified' : 'Unverified'}
                    </button>
                  )}
                </td>
                <td className="p-3 text-sm">
                  {u.role !== 'Admin' && (
                    <button onClick={() => toggleBlock(u._id, u.isBlocked)} className={`px-3 py-1 rounded text-xs font-semibold hover:opacity-90 transition ${u.isBlocked ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'}`}>
                      {u.isBlocked ? 'Unblock' : 'Block'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ManageTasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  useEffect(() => { axios.get("/api/admin/tasks").then(res => setTasks(res.data)); }, []);

  const handleDelete = async (id: string) => {
    if(!confirm("Force delete task?")) return;
    try {
      await axios.delete(`/api/tasks/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (e) { alert("Failed"); }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Manage Tasks</h2>
      <div className="space-y-3">
        {tasks.map(t => (
          <div key={t._id} className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 flex justify-between items-center hover:shadow-sm transition">
            <div>
              <div className="font-semibold text-gray-900 dark:text-white">{t.title}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{t.client_email} • {t.status}</div>
            </div>
            <button onClick={() => handleDelete(t._id)} className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm font-semibold transition">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Transactions() {
  const [txs, setTxs] = useState<any[]>([]);
  useEffect(() => { axios.get("/api/admin/transactions").then(res => setTxs(res.data)); }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Transactions History</h2>
      <div className="overflow-x-auto border rounded-lg border-gray-200 dark:border-gray-800">
        <table className="w-full text-left bg-white dark:bg-gray-900">
          <thead className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">
            <tr>
              <th className="p-3 text-sm font-semibold">Client Email</th>
              <th className="p-3 text-sm font-semibold">Freelancer Email</th>
              <th className="p-3 text-sm font-semibold">Payout Size</th>
              <th className="p-3 text-sm font-semibold">Payment Date</th>
              <th className="p-3 text-sm font-semibold">Payment Status Label</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
            {txs.map(t => (
              <tr key={t._id} className="border-b border-gray-105 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="p-3 text-sm">{t.client_email}</td>
                <td className="p-3 text-sm">{t.freelancer_email}</td>
                <td className="p-3 text-sm font-medium text-gray-900 dark:text-white">${t.amount}</td>
                <td className="p-3 text-sm">{new Date(t.paid_at).toLocaleDateString()}</td>
                <td className="p-3 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${
                    t.payment_status === 'paid' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' : 'bg-gray-55 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
                  }`}>
                    {t.payment_status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
