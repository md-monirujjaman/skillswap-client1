import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../contexts/AuthContext";

export default function EditProfile() {
  const { user, checkAuth } = useAuth();
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [skills, setSkills] = useState("");
  const [bio, setBio] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setImage(user.image || "");
      setSkills(user.skills?.join(", ") || "");
      setBio(user.bio || "");
      setHourlyRate(user.hourlyRate?.toString() || "0");
    }
  }, [user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    try {
      await axios.put("/api/users/profile", {
        name,
        image,
        skills: skills.split(",").map(s => s.trim()).filter(s => s),
        bio,
        hourlyRate: Number(hourlyRate)
      });
      await checkAuth();
      setSuccess(true);
    } catch (e) {
      alert("Failed to update profile");
    }
  };

  return (
    <div className="max-w-2xl text-sm">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Edit Public Profile</h2>
      {success && <div className="mb-4 p-3 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/40 rounded-md text-sm border border-green-200 dark:border-green-850">Profile updated successfully!</div>}
      
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Full Name</label>
          <input required type="text" value={name} onChange={e=>setName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white rounded-md focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Profile Photo URL</label>
          <input type="url" value={image} onChange={e=>setImage(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white rounded-md focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Skills (comma separated)</label>
          <input type="text" value={skills} onChange={e=>setSkills(e.target.value)} placeholder="React, Node.js, Design" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white rounded-md focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Bio</label>
          <textarea rows={4} value={bio} onChange={e=>setBio(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white rounded-md focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white outline-none resize-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Hourly Rate (USD)</label>
          <input type="number" min="0" value={hourlyRate} onChange={e=>setHourlyRate(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white rounded-md focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white outline-none" />
        </div>
        
        <button type="submit" className="bg-black text-white dark:bg-white dark:text-black px-6 py-2 rounded-md font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition">Save Changes</button>
      </form>
    </div>
  );
}
