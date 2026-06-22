import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, LayoutGrid, PenTool, Code, TrendingUp, Users, Star, BadgeCheck } from "lucide-react";
import { motion } from "motion/react";
import axios from "axios";

export default function Home() {
  const [data, setData] = useState<{
    latestTasks: any[];
    topFreelancers: any[];
    stats: { totalTasks: number; totalUsers: number; totalPayout: number } | null;
  }>({ latestTasks: [], topFreelancers: [], stats: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/home")
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-center py-20 mb-12"
      >
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 mt-4">Get your tasks done by skilled freelancers</h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
          SkillSwap is a faster way to get work done. Post tiny jobs or large tasks, receive proposals, and hire experts instantly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/dashboard/client" className="bg-black text-white dark:bg-white dark:text-black px-8 py-4 rounded-lg font-medium hover:opacity-90 transition flex items-center justify-center gap-2">
            Post a Task <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/tasks" className="bg-white border border-gray-200 text-black dark:bg-gray-900 dark:border-gray-800 dark:text-white px-8 py-4 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition shadow-sm">
            Browse Tasks
          </Link>
        </div>
      </motion.section>

      {/* Dynamic Section 1 — Latest Featured Tasks */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
        className="py-16 mb-12"
      >
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-bold">Latest Featured Tasks</h2>
          <Link to="/tasks" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">View all tasks</Link>
        </div>
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading tasks...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.latestTasks.map((task) => (
              <motion.div variants={itemVariants} key={task._id}>
                <Link to={`/tasks/${task._id}`} className="group block h-full">
                  <div className="bg-white dark:bg-gray-900 border text-left border-gray-200 dark:border-gray-800 rounded-xl p-6 h-full flex flex-col hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4 gap-2">
                      <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-800 text-xs font-medium rounded-full text-gray-800 dark:text-gray-200 truncate">
                        {task.category}
                      </span>
                      <span className="font-semibold text-green-600">${task.budget}</span>
                    </div>
                    <h3 className="text-lg font-semibold tracking-tight mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {task.title}
                    </h3>
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 mt-auto flex flex-col gap-1">
                      <span>Client: {task.client_name || task.client_email}</span>
                      <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
            {data.latestTasks.length === 0 && (
              <div className="col-span-full text-center py-10 text-gray-500 bg-gray-50 dark:bg-gray-900 rounded-xl">No open tasks right now.</div>
            )}
          </div>
        )}
      </motion.section>

      {/* Dynamic Section 2 — Top Freelancers */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
        className="py-16 mb-12 bg-gray-100 dark:bg-gray-800/20 rounded-3xl p-8"
      >
        <h2 className="text-3xl font-bold text-center mb-10">Top Freelancers</h2>
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading freelancers...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.topFreelancers.map((user) => (
              <motion.div variants={itemVariants} key={user._id}>
                <Link to={`/freelancers/${user._id}`} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 text-center hover:shadow-md transition-shadow h-full flex flex-col">
                  <img 
                    src={user.image || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} 
                    alt={user.name} 
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border border-gray-100 dark:border-gray-800"
                  />
                  <h3 className="font-bold text-lg mb-1 flex items-center justify-center gap-1">
                    {user.name}
                    {user.isVerified && (
                      <BadgeCheck className="w-5 h-5 text-blue-500" />
                    )}
                  </h3>
                  <div className="flex gap-1 justify-center text-yellow-400 mb-3 text-sm font-medium">
                    <Star className="w-4 h-4 fill-current" /> {user.average_rating || "5.0"}
                  </div>
                  <div className="flex flex-wrap justify-center gap-1 mb-4 h-12 overflow-hidden">
                    {(user.skills || []).slice(0, 3).map((s: string) => (
                      <span key={s} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded text-xs">{s}</span>
                    ))}
                  </div>
                  <div className="text-sm mt-auto border-t border-gray-100 dark:border-gray-800 pt-3 text-gray-500 dark:text-gray-400">
                    <span className="font-semibold text-black dark:text-white">{user.finished_jobs || 0}</span> finished jobs
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>

      {/* How It Works Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
        className="py-16 mb-12"
      >
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "1. Post a Task",
              description: "Describe what you need done, set your budget, and choose a deadline.",
            },
            {
              title: "2. Get Proposals",
              description: "Review offers from talented freelancers. Pick the one that fits best.",
            },
            {
              title: "3. Hire and Pay",
              description: "Pay securely via Stripe. The freelancer begins working immediately.",
            }
          ].map((step, idx) => (
            <motion.div variants={itemVariants} key={idx} className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 text-center shadow-sm hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 bg-black text-white dark:bg-white dark:text-black rounded-full flex items-center justify-center mx-auto mb-6 font-bold text-xl">
                {idx + 1}
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-gray-500 dark:text-gray-400">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Categories */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
        className="py-16 mb-12 bg-gray-100 dark:bg-gray-800/50 rounded-3xl px-8"
      >
        <h2 className="text-3xl font-bold text-center mb-12">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "Design", icon: <PenTool className="w-6 h-6 mb-3 text-blue-500" /> },
            { name: "Writing", icon: <CheckCircle2 className="w-6 h-6 mb-3 text-green-500" /> },
            { name: "Development", icon: <Code className="w-6 h-6 mb-3 text-purple-500" /> },
            { name: "Marketing", icon: <TrendingUp className="w-6 h-6 mb-3 text-orange-500" /> },
            { name: "Video", icon: <LayoutGrid className="w-6 h-6 mb-3 text-pink-500" /> },
            { name: "Other", icon: <Users className="w-6 h-6 mb-3 text-gray-500" /> }
          ].map((cat, idx) => (
            <motion.div variants={itemVariants} key={idx}>
              <Link to={`/tasks?category=${cat.name}`} className="block h-full bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700 text-center hover:shadow-md hover:-translate-y-1 transition-all">
                <div className="flex justify-center">{cat.icon}</div>
                <div className="font-medium text-gray-900 dark:text-white">{cat.name}</div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>
      
      {/* Platform Stats */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
        className="py-16 text-center"
      >
        <h2 className="text-3xl font-bold mb-12">By the Numbers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { label: "Tasks Posted", value: data.stats ? data.stats.totalTasks : "-" },
            { label: "Platform Users", value: data.stats ? data.stats.totalUsers : "-" },
            { label: "Total Payouts", value: data.stats ? `$${data.stats.totalPayout.toLocaleString()}` : "-" }
          ].map((stat, idx) => (
            <motion.div variants={itemVariants} key={idx}>
               <div className="text-5xl font-black mb-2 text-black dark:text-white">
                  {stat.value}
               </div>
               <div className="text-gray-500 dark:text-gray-400 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
