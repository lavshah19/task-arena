import React, { useEffect, useState } from 'react';
import { useAuth } from '../../component/context/AuthContext';
import ChallengeList from './ChallengeList';
import { Trophy, Loader, AlertCircle, Sparkles, Users, Lock, Search, X } from 'lucide-react';
import { useChallengeApi } from "../../api/challengeApi";

const ChallengeArena = () => {
  const { token, user } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [privateChallenges, setPrivateChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // Default status tab
  const [challengeType, setChallengeType] = useState('public'); // 'public' or 'private'
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');


  const { fetchMyParticipantChallenges, fetchAllPrivateChallenges } = useChallengeApi();


  useEffect(() => {
  const delay = setTimeout(() => {
    setDebouncedQuery(searchQuery);
  }, 300); // debounce delay in ms

  return () => clearTimeout(delay); // clear timeout on cleanup
}, [searchQuery]);
   const loadAll = async () => {
      try {
        setLoading(true);
        const [publicRes, privateRes] = await Promise.all([
          fetchMyParticipantChallenges(),
          fetchAllPrivateChallenges(),
        ]);
        setChallenges(publicRes.data.challenges || []);
        setPrivateChallenges(privateRes.data.challenges || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch challenges');
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    if (!token) return;

    loadAll();
  }, [token]);

  const actions = { token, user, fetchChallenges: loadAll };

  const selectedChallenges = challengeType === 'public' ? challenges : privateChallenges;

  // Filter challenges based on search query (title only)
const filteredChallenges = selectedChallenges.filter((challenge) => {
  if (!debouncedQuery.trim()) return true;

  const query = debouncedQuery.toLowerCase().trim();
  const title = (challenge.title || '').toLowerCase();

  return title.includes(query);
});


  const grouped = {
    all: [...filteredChallenges],
    pending: [],
    'in-progress': [],
    completed: [],
    cancelled: [],
  };

  filteredChallenges.forEach((c) => {
    const status = c.status || 'pending';
    grouped[status].push(c);
  });

  const clearSearch = () => {
    setSearchQuery('');
  };

  if (loading) {
    return (
     <div className="flex justify-center items-center min-h-screen w-full">
                 <div className="flex flex-col items-center space-y-3">
                   <Loader size={36} className="text-blue-600 animate-spin" />
                   <p className="text-gray-600 font-medium">Loading challenge...</p>
                 </div>
               </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 shadow-2xl border border-red-100 max-w-md w-full">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="p-4 bg-red-100 rounded-full">
              <AlertCircle className="w-12 h-12 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Oops! Something went wrong</h3>
            <p className="text-red-600 font-medium">{error}</p>
            <button 
              onClick={loadAll}
              className="mt-4 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all duration-200 transform hover:scale-105"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedChallenges.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-12 shadow-2xl border border-gray-100 max-w-lg w-full text-center">
          <div className="flex flex-col items-center space-y-6">
            <div className="p-6 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full">
              <Trophy className="w-16 h-16 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No Challenges Yet</h3>
              <p className="text-gray-600">No {challengeType} challenges available at the moment.</p>
              <p className="text-sm text-gray-500 mt-2">Check back soon for new opportunities!</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statusOptions = ['all', 'pending', 'in-progress', 'completed', 'cancelled'];

  const getStatusColor = (status) => {
    const colors = {
      all: 'from-purple-500 to-pink-500',
      pending: 'from-yellow-500 to-orange-500',
      'in-progress': 'from-blue-500 to-cyan-500',
      completed: 'from-green-500 to-emerald-500',
      cancelled: 'from-gray-500 to-slate-500',
    };
    return colors[status] || 'from-gray-500 to-slate-500';
  };

  const getStatusCount = (status) => grouped[status]?.length || 0;

  const hasSearchResults = searchQuery.trim() && filteredChallenges.length > 0;
  const hasSearchQuery = searchQuery.trim();
  const noSearchResults = hasSearchQuery && filteredChallenges.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* hero section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
              My Challenge 
            </h1>
            <p className="text-lg sm:text-xl text-white/90 mb-6">
              challenge that you have participated in, created or joined.
            </p>
            </div>
         </div>
      </div>
           
       <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 pt-7">
        {/* Search Bar */}
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-2xl">
            <div className={`bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border transition-all duration-300 ${
              searchFocused ? 'border-blue-300 shadow-2xl scale-105' : 'border-white/20'
            }`}>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search challenges by title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="w-full pl-12 pr-12 py-4 bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none text-lg"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors duration-200"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>
            </div>
            
            {/* Search Results Indicator */}
            {hasSearchQuery && (
              <div className="mt-3 text-center">
                <span className="inline-flex items-center space-x-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 text-sm">
                  <Search className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-700">
                    {noSearchResults 
                      ? `No results found for "${searchQuery}"` 
                      : `Found ${filteredChallenges.length} challenge${filteredChallenges.length !== 1 ? 's' : ''} for "${searchQuery}"`
                    }
                  </span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Challenge Type Selector */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-2 shadow-xl border border-white/20">
            <div className="flex gap-2">
              {['public', 'private'].map((type) => (
                <button
                  key={type}
                  onClick={() => setChallengeType(type)}
                  className={`group relative px-8 py-4 rounded-xl text-sm font-bold transition-all duration-300 transform ${
                    challengeType === type
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {type === 'public' ? (
                      <Users className="w-4 h-4" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                    <span>{type.toUpperCase()}</span>
                  </div>
                  {challengeType === type && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-20 animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-3 shadow-xl border border-white/20">
            <div className="flex gap-2 flex-wrap justify-center">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => setActiveTab(status)}
                  className={`group relative px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-105 ${
                    activeTab === status
                      ? `bg-gradient-to-r ${getStatusColor(status)} text-white shadow-lg scale-105`
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span>{status.replace('-', ' ').toUpperCase()}</span>
                    {getStatusCount(status) > 0 && (
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        activeTab === status 
                          ? 'bg-white/20 text-white' 
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {getStatusCount(status)}
                      </span>
                    )}
                  </div>
                  {activeTab === status && (
                    <div className={`absolute inset-0 bg-gradient-to-r ${getStatusColor(status)} rounded-xl opacity-20 animate-pulse`}></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Challenge List */}
        <div className="space-y-8">
          {grouped[activeTab]?.length > 0 ? (
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-b border-white/20">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-3">
                  <div className={`p-2 rounded-xl bg-gradient-to-r ${getStatusColor(activeTab)}`}>
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <span>
                    {challengeType.toUpperCase()} - {activeTab.replace('-', ' ').toUpperCase()}
                  </span>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-semibold text-gray-600">
                    {grouped[activeTab].length} challenge{grouped[activeTab].length !== 1 ? 's' : ''}
                  </span>
                  {hasSearchQuery && (
                    <span className="px-3 py-1 bg-blue-100 rounded-full text-sm font-semibold text-blue-700">
                      Filtered
                    </span>
                  )}
                </h2>
              </div>
              <div className="p-6">
                <ChallengeList
                  title={`${challengeType.toUpperCase()} - ${activeTab.replace('-', ' ').toUpperCase()}`}
                  challenges={grouped[activeTab]}
                  actions={actions}
                />
              </div>
            </div>
          ) : (
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/20 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className={`p-4 rounded-full bg-gradient-to-r ${getStatusColor(activeTab)} opacity-20`}>
                  {hasSearchQuery ? (
                    <Search className="w-12 h-12 text-gray-400" />
                  ) : (
                    <Trophy className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-600">
                  {hasSearchQuery 
                    ? `No results for "${searchQuery}"` 
                    : `No ${activeTab.replace('-', ' ')} challenges`
                  }
                </h3>
                <p className="text-gray-500">
                  {hasSearchQuery 
                    ? 'Try adjusting your search terms or browse all challenges'
                    : 'Be the first to create one or check back later!'
                  }
                </p>
                {hasSearchQuery && (
                  <button
                    onClick={clearSearch}
                    className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChallengeArena;