import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { User } from "../types";
import { Star, BadgeCheck } from "lucide-react";

export default function BrowseFreelancers() {
  const [freelancers, setFreelancers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFr = async () => {
      try {
        const res = await axios.get('/api/users/freelancers');
        setFreelancers(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchFr();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Top Freelancers</h1>
        <p className="text-gray-500 mt-1">Hire the best talent for your project.</p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-500">Loading talent...</div>
      ) : freelancers.length === 0 ? (
        <div className="py-20 text-center text-gray-500 border border-dashed rounded-xl border-gray-300">
          No freelancers available at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {freelancers.map(fr => (
            <Link to={`/freelancers/${fr._id}`} key={fr._id} className="group h-full">
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 text-center hover:shadow-md transition flex flex-col h-full">
                <img 
                  src={fr.image || `https://api.dicebear.com/7.x/initials/svg?seed=${fr.name}`} 
                  alt={fr.name} 
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border border-gray-100 dark:border-gray-800"
                />
                <div className="flex items-center justify-center gap-1">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{fr.name}</h3>
                  {fr.isVerified && <BadgeCheck className="w-5 h-5 text-blue-500" />}
                </div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Hourly: ${fr.hourlyRate || 0} / hr</div>
                
                <div className="flex flex-wrap justify-center gap-1 my-3 flex-1 items-start">
                  {fr.skills && fr.skills.slice(0, 3).map(skill => (
                    <span key={skill} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs rounded-md">{skill}</span>
                  ))}
                  {/* Plus more tags logic could go here */}
                </div>
                
                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 text-sm text-yellow-500 font-medium flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 fill-current" />
                  <span>New Talent</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
