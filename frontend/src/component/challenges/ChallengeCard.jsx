
import {
  Calendar,
  Award,
  Users,
  Edit,
  Trash2,
  LogOut,
  LogIn,
  ExternalLink,
  Clock,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getTimeFromNow, formatDate, passedDueDate } from "../../utils/dateUtils";
 import { useChallengeApi } from "../../api/challengeApi";
 import {  toast } from 'react-toastify';

const ChallengeCard = ({ challenge, actions }) => {
  const { fetchChallenges,user } = actions;
  const isCreator = challenge.creator?._id === user?._id;
  const isParticipant = challenge.participants.some((p) => p._id === user?._id);

  const navigate = useNavigate();
  const { joinChallenge, leaveChallenge, softDeleteChallenge } = useChallengeApi();

  const handleJoin = async () => {
    try {
      await joinChallenge(challenge._id);
      toast.success("Successfully joined the challenge!");
      fetchChallenges();
    } catch (error) {
      console.error("Failed to join challenge:", error);
      toast.error("Failed to join challenge. Please try again.");

    }
  };

  const handleLeave = async () => {
    try {
      await leaveChallenge(challenge._id);
      toast.success("Successfully left the challenge!");
      fetchChallenges();
    } catch (error) {
      console.error("Failed to leave challenge:", error);
      toast.error("Failed to leave challenge. Please try again.");
    }
  };

  const handleDelete = async () => {
    try {
      
      await softDeleteChallenge(challenge._id);
      toast.success("Challenge deleted successfully!");
      fetchChallenges();
    } catch (error) {
      console.error("Failed to delete challenge:", error);
      toast.error("Failed to delete challenge. Please try again.");
    }
  };

  const handleUpdate = () => {
    navigate(`/updatechallenge/${challenge._id}`);
  };

  const handleViewMore = () => {
    navigate(`/challengeinfo/${challenge._id}`);
  };

  // Set card border color based on status
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "border-orange-300";
      case "in-progress":
        return "border-blue-300";
      case "completed":
        return "border-green-300";
      case "cancelled":
        return "border-gray-300";
      default:
        return "border-purple-300";
    }
  };

  return (
    <div
      className={`p-5 border-2 ${getStatusColor(
        challenge.status
      )} rounded-xl shadow-sm hover:shadow-lg bg-white transition-all duration-300`}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-blue-600 line-clamp-2">
          {challenge.title}
        </h3>
        <div className="flex items-center gap-2">
        <div className="bg-gray-100 px-2 py-1 rounded text-xs font-medium text-gray-600">
          {challenge.status}
          
        </div>
         <div className="text-gray-500 text-xs font-bold">
          {challenge.isPrivate ? "Private" : "Public"}
          </div>
      </div>
        </div>
       

      <p className="text-gray-700 mb-4 line-clamp-2 text-sm">
        {challenge.description}
      </p>

      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 border-b pb-3">
        {challenge.creator?.profileImage ? (
          <img
            src={challenge.creator.profileImage}
            alt="creator"
            className="w-8 h-8 rounded-full object-cover border border-gray-200"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-medium">
            {challenge.creator?.username?.charAt(0).toUpperCase() || "?"}
          </div>
        )}
        <div>
          Created by{" "}
          <span className="font-medium">{challenge.creator?.username}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
        <div className="flex items-center gap-1 text-gray-600">
          <Users className="w-4 h-4" />
          <span>{challenge.participants.length} participants</span>
        </div>

        <div className="flex items-center gap-1 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(challenge.dueDate)}</span>
        </div>

        <div className="flex items-center gap-1 text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{getTimeFromNow(challenge.dueDate)}</span>
        </div>

        <div className="flex items-center gap-1 text-gray-600">
          <Star className="w-4 h-4" />
          <span>{challenge.points} points</span>
        </div>
      </div>

      {challenge.bonusPoints > 0 && (
        <div className="flex items-center gap-1 text-yellow-600 mb-3 text-sm bg-yellow-50 p-2 rounded">
          <Award className="w-4 h-4" />
          <span>Bonus: {challenge.bonusPoints} points</span>
        </div>
      )}

      {challenge.winner && (
        <div className="flex items-center gap-1 text-green-600 mb-3 text-sm bg-green-50 p-2 rounded">
          <Award className="w-4 h-4" />
          <span>Winner: {challenge.winner?.username}</span>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-4">
        <button
          onClick={handleViewMore}
          className="px-3 py-1.5 text-sm rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors flex items-center gap-1"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Details</span>
        </button>

        {isCreator ? (
          <>
            <button
              onClick={handleUpdate}
              className="px-3 py-1.5 text-sm rounded-full bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-colors flex items-center gap-1"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </button>
            <button
              onClick={handleDelete}
              className="px-3 py-1.5 text-sm rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </>
        ) : (
          !["completed", "cancelled"].includes(challenge.status)  && !passedDueDate(challenge.dueDate) &&
          (isParticipant ? (
            <button
              onClick={handleLeave}
              className="px-3 py-1.5 text-sm rounded-full bg-pink-100 text-pink-700 hover:bg-pink-200 transition-colors flex items-center gap-1"
            >
              <LogOut className="w-4 h-4" />
              <span>Leave</span>
            </button>
          ) : (
            <button
              onClick={handleJoin}
              className="px-3 py-1.5 text-sm rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors flex items-center gap-1"
            >
              <LogIn className="w-4 h-4" />
              <span>Join</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default ChallengeCard;
