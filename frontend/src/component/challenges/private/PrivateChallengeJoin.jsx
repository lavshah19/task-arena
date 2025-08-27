import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useChallengeApi } from "../../../api/challengeApi";
import { useAuth } from "../../context/AuthContext";

const PrivateChallengeJoin = () => {
  const { inviteCode } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { joinChallenge, joinPrivateChallengeAPI } = useChallengeApi();
  const [alreadyJoined, setAlreadyJoined] = useState(false);

  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const res = await joinPrivateChallengeAPI(inviteCode);
        const challengeData = res.data.challenge;

        const isParticipant = challengeData.participants.some(
          (p) => p._id === user._id
        );

        setAlreadyJoined(isParticipant);
        setChallenge(challengeData);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load private challenge."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [inviteCode, joinPrivateChallengeAPI, user._id]);

  const handleJoin = async () => {
    if (!challenge?._id) return;

    if (alreadyJoined) {
      return navigate(`/challengeinfo/${challenge._id}`);
    }

    try {
      setJoining(true);
      await joinChallenge(challenge._id);
      navigate(`/challengeinfo/${challenge._id}`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to join the challenge.");
    } finally {
      setJoining(false);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full text-center">
        <img
          src={challenge.creator.profileImage}
          alt="Creator"
          className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-blue-500 object-cover"
        />
        <h2 className="text-xl font-semibold text-gray-700">
          {challenge.creator.username} invited you!
        </h2>
        <p className="mt-2 text-gray-600">Join the private challenge:</p>
        <h3 className="mt-1 text-lg font-bold text-indigo-600">
          {challenge.title}
        </h3>

        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={handleJoin}
            disabled={joining}
            className={`${
              alreadyJoined
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-green-500 hover:bg-green-600"
            } text-white px-5 py-2 rounded-lg font-medium transition`}
          >
            {joining
              ? "Processing..."
              : alreadyJoined
              ? "Open Challenge"
              : "Join Challenge"}
          </button>

          <button
            onClick={handleCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-lg font-medium transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivateChallengeJoin;
