import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../component/context/AuthContext";
import { useParams } from "react-router-dom";
import ChallengeDetails from "./ChallengeDetails";
import UserProgressSection from "./UserProgressSection ";
import ParticipantsSection from "./ParticipantsSection";
import { Loader, AlertCircle } from "lucide-react";

const ChallengeInfo = () => {
  const { id } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token, user } = useAuth();
  const baseUrl = import.meta.env.VITE_API_URL;

  const fetchChallenge = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${baseUrl}/challenge/get/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setChallenge(res.data.challenge);
      setError(null);
    } catch (err) {
      console.error("Error fetching challenge:", err);
      setError("Failed to load challenge. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenge();
  }, [id]);

  const handleJoin = async () => {
    try {
      setActionLoading(true);
      await axios.post(
        `${baseUrl}/challenge/join/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchChallenge();
    } catch (err) {
      console.error("Error joining challenge:", err);
      alert("Could not join challenge. Try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeave = async () => {
    try {
      setActionLoading(true);
      await axios.post(
        `${baseUrl}/challenge/leave/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchChallenge();
    } catch (err) {
      console.error("Error leaving challenge:", err);
      alert("Could not leave challenge. Try again.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <div className="flex flex-col items-center space-y-3">
          <Loader size={36} className="text-blue-600 animate-spin" />
          <p className="text-gray-600 font-medium">Loading challenge...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 flex justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-lg flex items-start space-x-4">
          <AlertCircle size={24} className="text-red-500 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Challenge</h3>
            <p className="text-red-700">{error}</p>
            <button 
              onClick={fetchChallenge}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isParticipant = challenge.participants.some(
    (p) => p._id === user._id
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ChallengeDetails
          challenge={challenge}
          user={user}
          isParticipant={isParticipant}
          handleJoin={handleJoin}
          handleLeave={handleLeave}
          fetchChallenge={fetchChallenge}
        />
        <UserProgressSection challenge={challenge} fetchChallenge={fetchChallenge} />
        <ParticipantsSection challenge={challenge}  user={user} />
      </div>
    </div>
  );
};

export default ChallengeInfo;