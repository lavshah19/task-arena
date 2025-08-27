
import axios from "axios";
import { useAuth } from "../component/context/AuthContext";

const BASE_URL = import.meta.env.VITE_API_URL;

// This hook provides functions to interact with the challenge API
export const useChallengeApi = () => {
  const { token } = useAuth();

  // This function creates a new challenge
  const createChallenge = async (data) => {
    return axios.post(`${BASE_URL}/challenge/create`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  // This function allows a user to join a challenge by its ID
  const joinChallenge = async (challengeId) => {
    return axios.post(
      `${BASE_URL}/challenge/join/${challengeId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };
    // This function allows a user to leave a challenge by its ID
  const leaveChallenge = async (challengeId) => {
    return axios.post(
      `${BASE_URL}/challenge/leave/${challengeId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };
    // This function soft deletes a challenge by its ID
  const softDeleteChallenge = async (challengeId) => {
    return axios.patch(
      `${BASE_URL}/challenge/soft-delete/${challengeId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };
  const fetchAllChallenges = async () => {
    return axios.get(`${BASE_URL}/challenge/get`, {
      headers: { 
        Authorization: `Bearer ${token}`,
      },
    });
  }
  const fetchChallengeById = async (challengeId) => {
    return axios.get(`${BASE_URL}/challenge/get/${challengeId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  const deletePermanentlyChallenge =async (challengeId)=>{
    return await axios.delete(`${BASE_URL}/challenge/delete/${challengeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  }
  const fetchSoftDeletedChallengeAPI =async ()=>{
    return  await axios.get(`${BASE_URL}/challenge/get-soft-deleted`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  }
  const recoverChallengeAPI = async (challengeId)=>{
    return  await axios.patch(`${BASE_URL}/challenge/recover/${challengeId}`, {}, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  }
  const updateChallengeAPI =async (challengeId,updateData)=>{
    return await axios.put(`${BASE_URL}/challenge/update/${challengeId}`, updateData, {
        headers: {
           Authorization: `Bearer ${token}`,
           },
      });

  }
  const joinPrivateChallengeAPI = async (inviteCode) => {
    return axios.get(`${BASE_URL}/challenge/get-private/${inviteCode}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  const fetchAllPrivateChallenges = async () => {
    return axios.get(`${BASE_URL}/challenge/get-all-private`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  const fetchMyParticipantChallenges = async () => {
    return axios.get(`${BASE_URL}/challenge/myparticipant`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return {
    createChallenge,
    joinChallenge,
    leaveChallenge,
    softDeleteChallenge,
    fetchAllChallenges,
    fetchChallengeById,
    deletePermanentlyChallenge,
    fetchSoftDeletedChallengeAPI,
    recoverChallengeAPI,
    updateChallengeAPI,
    joinPrivateChallengeAPI,
    fetchAllPrivateChallenges,
    fetchMyParticipantChallenges,
  };
};
