import React from 'react';
import ChallengeCard from './ChallengeCard';
import { ChevronRight } from 'lucide-react';

const ChallengeList = ({ title, challenges, actions }) => {
  if (challenges.length === 0) return null;

  // Define color theme based on challenge status
  const getThemeColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-purple-100 text-purple-800 border-purple-200';
    }
  };

  const themeColor = getThemeColor(title);

  return (
    <div className="mb-10">
      <div className={`flex items-center ${themeColor} rounded-lg px-4 py-2 mb-4`}>
        <ChevronRight className="w-5 h-5 mr-2" />
        <h2 className="text-xl md:text-2xl font-semibold">{title}</h2>
        <span className="ml-3 px-2 py-1 bg-white bg-opacity-50 rounded-full text-sm font-medium">
          {challenges.length}
        </span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {challenges.map((challenge) => (
          <ChallengeCard key={challenge._id} challenge={challenge} actions={actions} />
        ))}
      </div>
    </div>
  );
};

export default ChallengeList;