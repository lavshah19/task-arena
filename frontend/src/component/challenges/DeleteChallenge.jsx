import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../component/context/AuthContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import { 
  Trash2, 
  RefreshCw, 
  AlertTriangle, 
  User, 
  Loader2, 
  Calendar, 
  Award,
  Search,
  XCircle,
  Clock
} from 'lucide-react';

Modal.setAppElement('#root'); // Replace with your app's root element id

const DeleteChallenge = () => {
  const { token } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const baseUrl = import.meta.env.VITE_API_URL;

  const fetchSoftDeletedChallenges = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/challenge/get-soft-deleted`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.success) {
        setChallenges(res.data.challenges);
      } else {
        toast.error(res.data.message || "Failed to fetch challenges");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Error fetching soft-deleted challenges");
    } finally {
      setLoading(false);
    }
  };

  const handleRecover = async (id) => {
    try {
      const loadingToast = toast.loading("Recovering challenge...");
      
      const res = await axios.patch(`${baseUrl}/challenge/recover/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.dismiss(loadingToast);
      
      if (res.data.success) {
        toast.success("Challenge recovered successfully!");
        fetchSoftDeletedChallenges();
      } else {
        toast.error(res.data.message || "Failed to recover challenge.");
      }
    } catch (error) {
      console.error("Recover error:", error);
      toast.error("Error recovering challenge.");
    }
  };

  const openDeleteModal = (challenge) => {
    setSelectedChallenge(challenge);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedChallenge(null);
  };

  const handlePermanentDelete = async () => {
    if (!selectedChallenge) return;
    
    closeModal();
    const loadingToast = toast.loading("Deleting challenge permanently...");
    
    try {
      const res = await axios.delete(`${baseUrl}/challenge/delete/${selectedChallenge._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.dismiss(loadingToast);
      
      if (res.data.success) {
        toast.success("Challenge permanently deleted!");
        fetchSoftDeletedChallenges();
      } else {
        toast.error(res.data.message || "Failed to delete challenge.");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Delete error:", error);
      toast.error("Error deleting challenge.");
    }
  };

  const filteredChallenges = challenges.filter(challenge => 
    challenge.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchSoftDeletedChallenges();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      
      <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Trash2 className="mr-2 text-red-500" size={24} />
            Soft Deleted Challenges
          </h2>
          <button 
            onClick={fetchSoftDeletedChallenges}
            className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search challenges..."
            className="pl-10 w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setSearchTerm("")}
            >
              <XCircle className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center p-12">
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            <span className="ml-2 text-lg text-gray-600">Loading challenges...</span>
          </div>
        ) : filteredChallenges.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <XCircle className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <p className="text-gray-500 text-lg">
              {searchTerm ? "No matching challenges found." : "No soft-deleted challenges found."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChallenges.map((challenge) => (
              <div key={challenge._id} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">{challenge.title}</h3>
                  
                  <div className="flex items-center mb-3 text-gray-600">
                    <User className="h-4 w-4 mr-1" />
                    <div className="flex items-center gap-2">
                      {challenge.creator?.profileImage && (
                        <img
                          src={challenge.creator.profileImage}
                          alt="creator"
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      )}
                      <span className="text-sm">
                        {challenge.creator?.username || "Unknown"}
                      </span>
                    </div>
                  </div>
                  
                  {challenge.dueDate && (
                    <div className="flex items-center mb-2 text-gray-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span className="text-sm">Due: {formatDate(challenge.dueDate)}</span>
                    </div>
                  )}
                  
                  {challenge.deletedAt && (
                    <div className="flex items-center mb-2 text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      <span className="text-sm">Deleted: {formatDate(challenge.deletedAt)}</span>
                    </div>
                  )}
                  
                  {challenge.points && (
                    <div className="flex items-center mb-3 text-gray-600">
                      <Award className="h-4 w-4 mr-1" />
                      <span className="text-sm">{challenge.points} Points</span>
                    </div>
                  )}
                </div>
                
                <div className="bg-gray-50 p-4 flex gap-2">
                  <button
                    onClick={() => handleRecover(challenge._id)}
                    className="flex-1 flex items-center justify-center gap-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-3 py-2 rounded-lg transition-colors"
                  >
                    <RefreshCw size={16} />
                    <span>Recover</span>
                  </button>
                  <button
                    onClick={() => openDeleteModal(challenge)}
                    className="flex-1 flex items-center justify-center gap-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Delete Confirmation"
        className="bg-white rounded-xl shadow-xl p-0 max-w-md mx-auto mt-20 outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div className="p-6">
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="h-10 w-10 text-red-500" />
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-center mb-2">Confirm Permanent Deletion</h3>
          
          <p className="text-gray-600 text-center mb-6">
            Are you sure you want to permanently delete "{selectedChallenge?.title}"? This action cannot be undone.
          </p>
          
          <div className="flex gap-3 justify-center">
            <button
              onClick={closeModal}
              className="px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handlePermanentDelete}
              className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              Delete Permanently
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DeleteChallenge;