import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { User } from "../types";
import { Star, BadgeCheck } from "lucide-react";

export default function FreelancerProfile() {
  const { id } = useParams();
  const [freelancer, setFreelancer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/users/freelancers/${id}`)
      .then(res => setFreelancer(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="py-20 text-center text-gray-500">Loading profile...</div>;
  if (!freelancer) return <div className="py-20 text-center text-red-500">Freelancer not found</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-900 border text-center border-gray-200 dark:border-gray-800 rounded-xl p-8 mb-8 shadow-sm">
        <img 
          src={freelancer.image || `https://api.dicebear.com/7.x/initials/svg?seed=${freelancer.name}`} 
          alt={freelancer.name} 
          className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border border-gray-100 dark:border-gray-800"
        />
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center justify-center gap-2 text-gray-900 dark:text-white">
          {freelancer.name}
          {freelancer.isVerified && (
            <BadgeCheck className="w-6 h-6 text-blue-500" />
          )}
        </h1>
        <div className="text-lg text-gray-500 dark:text-gray-400 mb-6">Hourly Rate: ${freelancer.hourlyRate || 0} / hr</div>

        <div className="max-w-2xl mx-auto text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
          {freelancer.bio || "This freelancer hasn't written a bio yet."}
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {freelancer.skills && freelancer.skills.map((skill: string) => (
            <span key={skill} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md font-medium text-sm">{skill}</span>
          ))}
        </div>

        <div className="flex justify-center items-center gap-2 text-yellow-500 font-medium">
          <Star className="w-5 h-5 fill-current" />
          <span>New Talent on SkillSwap</span>
        </div>
      </div>
      
      <div className="text-center">
         <Link to="/tasks" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Post a task and invite them!</Link>
      </div>
    </div>
  );
}
