import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../component/context/AuthContext';
import { Trophy, Medal, Loader2, AlertCircle, User, Crown } from 'lucide-react';

const Leaderboard = () => {
  const { token } = useAuth();
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        const res = await axios.get(`${baseUrl}/auth/get-top-users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTopUsers(res.data.topUsers);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch leaderboard');
      } finally {
        setLoading(false);
      }
    };

    fetchTopUsers();
  }, [token]);

  // Get medal color based on rank
  const getMedalColor = (index) => {
    switch (index) {
      case 0: return 'text-yellow-500'; // Gold
      case 1: return 'text-gray-400';   // Silver
      case 2: return 'text-amber-700';  // Bronze
      default: return 'text-blue-400';  // Other positions
    }
  };

  // Get background color for top 3
  const getRowBackground = (index) => {
    switch (index) {
      case 0: return 'bg-yellow-50';
      case 1: return 'bg-gray-50';
      case 2: return 'bg-amber-50';
      default: return 'bg-white';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-gray-600">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        <span>Loading leaderboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center text-red-600 bg-red-50 rounded-lg">
        <AlertCircle className="mr-2 h-5 w-5" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-lg mt-10 border border-gray-100">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Leaderboard</h2>
        </div>
        <div className="bg-blue-50 px-3 py-1 rounded-full text-blue-600 text-sm font-medium">
          Top Players
        </div>
      </div>

      {topUsers.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <User className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500 font-medium">No players found yet.</p>
          <p className="text-gray-400 text-sm mt-1">Be the first to join the leaderboard!</p>
        </div>
      ) : (
        <ol className="space-y-3">
          {topUsers.map((user, index) => (
            <li
              key={user._id}
              className={`flex items-center justify-between p-4 rounded-lg shadow-sm transition-all hover:shadow-md ${getRowBackground(index)}`}
            >
              <div className="flex items-center gap-4">
                {index < 3 ? (
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-opacity-20 ${index === 0 ? 'bg-yellow-100' : index === 1 ? 'bg-gray-100' : 'bg-amber-100'}`}>
                    {index === 0 ? (
                      <Crown className={`h-5 w-5 ${getMedalColor(index)}`} />
                    ) : (
                      <Medal className={`h-5 w-5 ${getMedalColor(index)}`} />
                    )}
                  </div>
                ) : (
                  <span className="text-lg font-bold w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    {index + 1}
                  </span>
                )}
                
                <div className="relative">
                  <img
                    src={user.profileImage || `https://api.dicebear.com/9.x/adventurer/svg?seed=${user.username}`}
                    alt={user.username}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  {index === 0 && (
                    <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
                      <Crown className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800">{user.username}</span>
                  <span className="text-xs text-gray-500">Member</span>
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <div className="text-lg font-bold text-gray-800">
                  {user.points} 
                  <span className="text-sm text-blue-600 ml-1">pts</span>
                </div>
                {index === 0 && (
                  <span className="text-xs text-yellow-600 font-medium">Leader</span>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}
      
      <div className="text-center mt-6 text-xs text-gray-400">
        Leaderboard last updated: {new Date().toLocaleDateString()}
      </div>
    </div>
  );
};

export default Leaderboard;