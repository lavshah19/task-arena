import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../component/context/AuthContext";
import CreateProgressForm from "./CreateProgressForm";
import UpdateProgressForm from "./UpdateProgressForm";
import Modal from "react-modal";
import { toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  Clipboard, 
  Edit, 
  Trash2, 
  Plus, 
  CheckCircle, 
  XCircle, 
  ThumbsUp, 
  ExternalLink, 
  MessageSquare, 
  Loader,
  AlertCircle 
} from "lucide-react";

// Set the app element for accessibility
Modal.setAppElement('#root');

const UserProgressSection = ({ challenge, fetchChallenge }) => {
  const { user, token } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [voteLoading, setVoteLoading] = useState(false);
  const [votingForId, setVotingForId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const baseUrl = import.meta.env.VITE_API_URL;

  const userProgress = challenge.userProgress.find(
    (progress) => progress.user._id === user?._id
  );

  const hasSubmitted = !!userProgress;

  // Get whom the current user voted for
  const votedEntry = challenge.votes.find(
    (v) => v.voter === user?._id
  );
  const votedForId = votedEntry?.votedFor;

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDelete = async () => {
    closeDeleteModal();
    
    try {
      const res = await axios.delete(
        `${baseUrl}/challenge/remove-progress/${challenge._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        
        fetchChallenge();
        toast.success("Progress deleted successfully.");
        
      } else {
        toast.error(res.data.message || "Failed to delete progress.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response.data.message||"Error deleting progress.");
    }
  };

  const handleVote = async (votedForId) => {
    if (!token || !votedForId || voteLoading) return;

    setVoteLoading(true);
    setVotingForId(votedForId);

    try {
      const res = await axios.post(
        `${baseUrl}/challenge/vote/${challenge._id}`,
        { votedForId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        fetchChallenge();
        toast.success("Your vote has been recorded.");
      } else {
        toast.error(res.data.message || "Voting failed");
      }
    } catch (error) {
      console.error("Vote error:", error);
      toast.error("Error submitting vote");
    } finally {
      setVoteLoading(false);
      setVotingForId(null);
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
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 col-span-1 transition-all hover:shadow-lg overflow-hidden">

      
      <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
        <Clipboard size={20} className="text-blue-600" />
        <h3 className="text-lg font-bold text-gray-800">User Progress</h3>
      </div>

      {!hasSubmitted && !["completed", "cancelled"].includes(challenge.status) && (
        <div className="mb-6">
          
          { !showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Submit Your Progress
            </button>
          ) : (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <CreateProgressForm
                challengeId={challenge._id}
                onClose={() => setShowForm(false)}
                fetchChallenge={fetchChallenge}
              />
            </div>
          )}
        </div>
      )}

      {hasSubmitted && (
        <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-gray-800">Your Submission</h4>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setShowEditForm(true)}
                className="p-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg transition-colors"
                title="Edit your progress"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={openDeleteModal}
                className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                title="Delete your progress"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          
          {showEditForm ? (
            <UpdateProgressForm
              challengeId={challenge._id}
              onClose={() => setShowEditForm(false)}
              fetchChallenge={fetchChallenge}
              currentProgress={userProgress}
            />
          ) : (
            <div className="text-sm space-y-2">
              <div className="flex gap-2 items-center">
                <span className="font-medium">Status:</span>
                {userProgress.completed ? (
                  <span className="text-green-600 flex items-center gap-1">
                    <CheckCircle size={16} />
                    Completed
                  </span>
                ) : (
                  <span className="text-gray-600 flex items-center gap-1">
                    <XCircle size={16} />
                    Not Completed
                  </span>
                )}
              </div>
              <div className="flex gap-2 items-center">
                <span className="font-medium">Points Earned:</span>
                <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                  {userProgress.pointsEarned}
                </span>
              </div>
              {userProgress.notes && (
                <div>
                  <span className="font-medium">Notes:</span>
                  <p className="mt-1 text-gray-700 bg-white p-2 rounded border border-gray-200">
                    {userProgress.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="mt-4">
        <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
          <Clipboard size={16} className="text-blue-600" />
          All Progress Submissions
          <span className="ml-auto bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
            {challenge.userProgress.length}
          </span>
        </h4>

        {challenge.userProgress.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">No progress submissions yet</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[400px] overflow-auto pr-2">
            {challenge.userProgress.map((progress, index) => (
              <div 
                key={index} 
                className={`border rounded-lg p-4 shadow-sm ${
                  progress.user._id === user?._id ? "bg-blue-50 border-blue-200" : "bg-white"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={
                      progress.user.profileImage ||
                      "https://api.dicebear.com/9.x/adventurer/svg?seed=" + progress.user.username
                    }
                    alt={progress.user.username}
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {progress.user.username}
                      {progress.user._id === user?._id && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                          You
                        </span>
                      )}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      {progress.completed ? (
                        <span className="text-green-600 flex items-center gap-1">
                          <CheckCircle size={12} />
                          Completed
                        </span>
                      ) : (
                        <span className="text-gray-600 flex items-center gap-1">
                          <XCircle size={12} />
                          In progress
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-600">Points:</span>
                    <span className="font-medium bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-xs">
                      {progress.pointsEarned}
                    </span>
                  </div>
                  
                  {progress.submissionLink && (
                    <a
                      href={progress.submissionLink}
                      className="text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink size={14} />
                      View Submission
                    </a>
                  )}
                </div>

                {progress.notes && (
                  <div className="mt-2 text-sm">
                    <div className="flex items-center gap-1 text-gray-600 mb-1">
                      <MessageSquare size={14} />
                      <span>Notes:</span>
                    </div>
                    <p className="text-gray-700 bg-white p-2 rounded border border-gray-200 text-sm">
                      {progress.notes}
                    </p>
                  </div>
                )}

                {progress.completed && 
                 progress.user._id !== user?._id && 
                 challenge.status !== "completed" && (
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => handleVote(progress.user._id)}
                      disabled={voteLoading}
                      className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-sm ${
                        votedForId === progress.user._id
                          ? "bg-green-500 hover:bg-green-600 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      {voteLoading && votingForId === progress.user._id ? (
                        <Loader size={14} className="animate-spin" />
                      ) : (
                        <ThumbsUp size={14} />
                      )}
                      {votedForId === progress.user._id ? "Voted" : "Vote"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeDeleteModal}
        style={customModalStyles}
        contentLabel="Delete Confirmation"
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <AlertCircle size={24} className="text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Progress</h3>
          <p className="text-sm text-gray-500 mb-6">
            Are you sure you want to delete your progress? This action cannot be undone.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={closeDeleteModal}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserProgressSection;