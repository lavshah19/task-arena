import axios from "axios";
import { useAuth } from "../../component/context/AuthContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState } from "react";
import Modal from "react-modal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Award, Calendar, Medal, Check, X, Trophy, Clock, AlertCircle, User } from "lucide-react";
dayjs.extend(relativeTime);

// Set the app element for accessibility
Modal.setAppElement('#root');

const ChallengeDetails = ({
  challenge,
  user,
  isParticipant,
  handleJoin,
  handleLeave,
  fetchChallenge,
}) => {
  const { token } = useAuth();
  const isCreator = challenge.creator?._id === user?._id;
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
  const baseUrl = import.meta.env.VITE_API_URL;

  const openFinishModal = () => {
    setIsFinishModalOpen(true);
  };

  const closeFinishModal = () => {
    setIsFinishModalOpen(false);
  };

  const handleFinishChallenge = async () => {
    closeFinishModal();

    try {
      const res = await axios.post(
        `${baseUrl}/challenge/winner/${challenge._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Challenge finalized. Points awarded.");
        fetchChallenge(); // Refresh challenge data
      } else {
        toast.error(res.data.message || "Failed to finish challenge");
      }
    } catch (err) {
      console.error("Error finishing challenge:", err);
      toast.error(err.response.data.message||"Error finishing challenge.");
    }
  };

  const isPastDue = dayjs().isAfter(dayjs(challenge.dueDate));
  const timeRemaining = dayjs().to(dayjs(challenge.dueDate));
  
  // Determine status badge style
  const getStatusBadgeStyle = () => {
    switch (challenge.status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Custom styles for the modal
  const customModalStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      borderRadius: '0.5rem',
      padding: '2rem',
      maxWidth: '500px',
      width: '90%',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      zIndex: 1000,
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 col-span-1 transition-all hover:shadow-lg">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
          <Trophy size={22} className="text-blue-600" />
          {challenge.title}
        </h2>
        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusBadgeStyle()}`}>
          <Clock size={14} />
          {challenge.status}
        </span>
      </div>
      
      {/* Creator info */}
      <div className="flex items-center gap-2 mb-4 bg-gray-50 p-2 rounded-lg">
         <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-blue-200">
                  {challenge.creator?.profileImage ? (
                    <img 
                      src={challenge.creator?.profileImage} 
                      alt={challenge.creator?.username} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                      <User size={16} className="text-gray-500" />
                    </div>
                  )}
                </div>
        <span className="text-sm font-medium text-gray-700">
          Created by: <span className="text-blue-600">{challenge.creator?.username}</span>
        </span>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-4">
        <p className="text-gray-700">{challenge.description}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar size={18} className="text-blue-600" />
          <div>
            <p className="font-medium">Due Date</p>
            <p className="text-sm">{dayjs(challenge.dueDate).format("MMMM D, YYYY")}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-gray-600">
          <Clock size={18} className={isPastDue ? "text-red-500" : "text-blue-600"} />
          <div>
            <p className="font-medium">Time Status</p>
            <p className={`text-sm ${isPastDue ? "text-red-500 font-medium" : ""}`}>
              {isPastDue ? "Past due" : timeRemaining}
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-3 mb-5 border-t border-gray-100 pt-4">
        <div className="flex items-center gap-1 bg-purple-100 px-3 py-1 rounded-full">
          <Award size={16} className="text-purple-700" />
          <span className="text-sm font-medium text-purple-700">{challenge.points} Points</span>
        </div>
        
        <div className="flex items-center gap-1 bg-amber-100 px-3 py-1 rounded-full">
          <Medal size={16} className="text-amber-700" />
          <span className="text-sm font-medium text-amber-700">Bonus: {challenge.bonusPoints}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {!isCreator && (isParticipant ? (
          <button
            onClick={handleLeave}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <X size={18} />
            Leave Challenge
          </button>
        ) : (
          <button
            onClick={handleJoin}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <Check size={18} />
            Join Challenge
          </button>
        ))}
  
        {user?._id === challenge.creator._id && challenge.status !== "completed" && (
          <button
            type="button"
            onClick={openFinishModal}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isPastDue}
          >
            <Trophy size={18} />
            Finish Challenge
          </button>
        )}
      </div>
      
      {challenge.winner && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
          <Trophy size={20} className="text-yellow-600" />
          <p className="text-yellow-800 font-medium">
            Winner: {challenge.winner?.username}
          </p>
        </div>
      )}
      
      {isPastDue && challenge.status !== "completed" && (
        <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} className="text-red-500" />
          <p className="text-red-700 text-sm">
            This challenge is past its due date
          </p>
        </div>
      )}

      {/* Finish Challenge Confirmation Modal */}
      <Modal
        isOpen={isFinishModalOpen}
        onRequestClose={closeFinishModal}
        style={customModalStyles}
        contentLabel="Finish Challenge Confirmation"
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 mb-4">
            <Trophy size={24} className="text-purple-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Finish Challenge</h3>
          <p className="text-sm text-gray-500 mb-6">
            Are you sure you want to finish this challenge? This will finalize the challenge and award points to participants.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={closeFinishModal}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleFinishChallenge}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Finish Challenge
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ChallengeDetails;