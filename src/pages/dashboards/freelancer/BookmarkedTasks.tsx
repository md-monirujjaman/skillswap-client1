import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Task } from "../../../types";
import { Bookmark } from "lucide-react";

export default function BookmarkedTasks() {
  const [bookmarks, setBookmarks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await axios.get('/api/users/bookmarks');
        setBookmarks(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, []);

  const handleRemove = async (id: string) => {
    try {
      await axios.post(`/api/users/bookmark/${id}`);
      setBookmarks(bookmarks.filter(b => b._id !== id));
    } catch (e) {
      alert("Failed to remove bookmark");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Bookmarked Tasks</h2>
      {loading ? (
        <div className="py-10 text-center text-gray-500">Loading...</div>
      ) : bookmarks.length === 0 ? (
        <div className="text-gray-500 py-10 border border-dashed dark:border-gray-800 rounded-lg text-center">
          You haven't bookmarked any open jobs yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookmarks.map(t => (
            <div key={t._id} className="p-5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 group">
              <div className="flex justify-between items-start mb-2">
                <Link to={`/tasks/${t._id}`} className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {t.title}
                </Link>
                <button onClick={() => handleRemove(t._id)} className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300" title="Remove Bookmark">
                  <Bookmark className="w-5 h-5 fill-current" />
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">{t.description}</p>
              <div className="flex justify-between items-center mt-auto">
                <span className="font-bold text-gray-900 dark:text-white">${t.budget}</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  t.status === 'Open' ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
                }`}>
                  {t.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
