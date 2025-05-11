import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../component/context/AuthContext';
import ChallengeList from './ChallengeList';
import { Trophy, Loader, AlertCircle } from 'lucide-react';

const ChallengeArena = () => {
  const { token, user } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const baseUrl = import.meta.env.VITE_API_URL;

  const fetchChallenges = async () => {
    try {
      const res = await axios.get(`${baseUrl}/challenge/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChallenges(res.data.challenges || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch challenges');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchChallenges();
  }, [token]);

  const actions = { fetchChallenges, token, user };

  const grouped = {
    pending: [],
    'in-progress': [],
    completed: [],
    cancelled: [],
  };

  challenges.forEach((c) => grouped[c.status || 'pending'].push(c));

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader className="w-10 h-10 text-blue-600 animate-spin" />
      <span className="ml-3 text-lg font-medium text-gray-700">Loading challenges...</span>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center h-64 text-red-500">
      <AlertCircle className="w-8 h-8 mr-2" />
      <span>{error}</span>
    </div>
  );
  if (challenges.length === 0) return (
    <div className="flex items-center justify-center h-64 text-gray-500">
      <Trophy className="w-8 h-8 mr-2" />
      <span>No challenges available at the moment.</span>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <div className="flex items-center justify-center mb-8">
        <Trophy className="w-8 h-8 mr-3 text-yellow-500" />
        <h1 className="text-3xl md:text-4xl font-bold text-blue-700"> Challenges </h1>
      </div>
      
      <div className="grid grid-cols-1 gap-10">
        {Object.entries(grouped).map(([status, list]) => (
          list.length > 0 && (
            <ChallengeList
              key={status}
              title={status.replace('-', ' ').toUpperCase()}
              challenges={list}
              actions={actions}
            />
          )
        ))}
      </div>
    </div>
  );
};

export default ChallengeArena;
