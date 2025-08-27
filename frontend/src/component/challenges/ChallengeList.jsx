import React from "react";
import ChallengeCard from "./ChallengeCard";
const ChallengeList = ({ title, challenges, actions }) => {
  if (challenges.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {challenges.map((challenge) => (
          <ChallengeCard
            key={challenge._id}
            challenge={challenge}
            actions={actions}
          />
        ))}
      </div>
    </div>
  );
};

export default ChallengeList;
