import { Users, ThumbsUp, Star, Medal } from "lucide-react";
import { Link } from "react-router-dom";

const ParticipantsSection = ({ challenge,user }) => {
  const getVotesForParticipant = (participantId) => {
    return challenge.votes.filter((v) => v.votedFor === participantId).length;
  };

  // Sort participants by votes (descending)
  const sortedParticipants = [...challenge.participants].sort(
    (a, b) => getVotesForParticipant(b._id) - getVotesForParticipant(a._id)
  );

  const isCreator=(participantid)=>{
    return challenge.creator._id === participantid;

  }


  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 col-span-1 transition-all hover:shadow-lg">
      <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
        <Users size={20} className="text-blue-600" />
        <h3 className="text-lg font-bold text-gray-800">Participants</h3>
        <span className="ml-auto bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {challenge.participants.length}
        </span>
      </div>

      {challenge.participants.length === 0 ? (
        <div className="text-center py-6 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No participants yet</p>
        </div>
      ) : (
        <ul className="space-y-4 mt-3">
          {sortedParticipants.map((participant, index) => {
            const votes = getVotesForParticipant(participant._id);
            const isTopVoted = index === 0 && votes > 0;
            
            return (
              <li 
                key={participant._id} 
                className={`flex items-center gap-4 p-3 rounded-lg transition-all ${
                  isTopVoted 
                    ? "bg-yellow-50 border border-yellow-200" 
                    : "border border-gray-100 hover:bg-gray-50"
                }`}
              >
                {isTopVoted && (
                  <div className="absolute -mt-8 -ml-2 ">
                    <Medal size={18} className="text-yellow-500" />
                  </div>
                )}
                
                <img
                  src={
                    participant.profileImage ||
                    "https://api.dicebear.com/9.x/adventurer/svg?seed=" + participant.username
                  }
                  alt={participant.username}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                />
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Link to={`/profile/${participant._id}`} className="text-blue-600 hover:underline">
                    <p className="font-medium text-gray-900">{participant.username}</p>
                    </Link>
                    {isCreator(participant._id) && <span className="text-xs text-gray-500">Creator</span>} 
                    {index < 3 && votes > 0 && (
                      <Star size={14} className={`
                        ${index === 0 ? "text-yellow-500" : ""}
                        ${index === 1 ? "text-gray-400" : ""}
                        ${index === 2 ? "text-amber-700" : ""}
                      `} />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 mt-1">
                    <div className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Star size={12} />
                      <span>{participant.points || 0} pts</span>
                    </div>
                    
                    <div className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                      <ThumbsUp size={12} />
                      <span>{votes} votes</span>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ParticipantsSection;