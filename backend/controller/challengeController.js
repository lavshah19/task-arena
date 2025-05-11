const Challenge = require("../models/challenge");
const User = require("../models/User");

// Create a new challenge
const createChallenge = async (req, res) => {
  try {
    const { title, description, dueDate,points,bonusPoints } = req.body;
    const creatorId = req.userInfo.userId; // assumed to be ObjectId or string

    const challenge = new Challenge({
      // should use "new Challenge", not "await Challenge(...)" i always forgot reminder
      creator: creatorId,
      title,
      description,
      dueDate,
      points,
      bonusPoints,
      participants: [creatorId],
    });

    await challenge.save();

    res.status(201).json({
      success: true,
      message: "Challenge created",
      challenge,
    });
  } catch (error) {
    console.error("Create Challenge Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error creating challenge",
    });
  }
};

// Delete a challenge (only creator can delete)
const deleteChallenge = async (req, res) => {
  try {
    const challengeId = req.params.id;
    const userId = req.userInfo.userId;

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found",
      });
    }

    // Fix: ensure userId is cast to ObjectId for comparison if needed
    if (!challenge.creator.equals(userId)) {
      return res.status(403).json({
        success: false,
        message: "Only the creator can delete this challenge",
      });
    }

    await Challenge.findByIdAndDelete(challengeId);

    res.json({
      success: true,
      message: "Challenge deleted successfully",
    });
  } catch (error) {
    console.error("Delete Challenge Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error deleting challenge",
    });
  }
};

const getAllChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find({ isDeleted: false }) // exclude soft-deleted
      .populate("creator", "username profileImage") // optional: include creator info
      .populate("participants", "username points") // optional
      .sort({ createdAt: -1 }); // latest first
    if (!challenges || challenges.length === 0) {
      return res.status(200).json({
        success: true,
        challenges: [],
        message: "No challenges found",
      });
    }

    res.status(200).json({
      success: true,
      challenges,
    });
  } catch (error) {
    console.error("Get All Challenges Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching challenges",
    });
  }
};

const getSingleChallenge = async (req, res) => {
  try {
    const challengeId = req.params.id;

    const challenge = await Challenge.findOne({
      _id: challengeId,
      isDeleted: false,
    })
      .populate("creator", "username profileImage")
      .populate("participants", "username points profileImage")
      .populate("winner", "username profileImage")
      .populate("userProgress" , "user completed pointsEarned submissionLink notes completedAt")
      .populate("userProgress.user", "username profileImage _id ")
      .sort({ createdAt: -1 });

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found",
      });
    }

    res.status(200).json({
      success: true,
      challenge,
    });
  } catch (error) {
    console.error("Get Single Challenge Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching challenge",
    });
  }
};

const updateChallenge = async (req, res) => {
  try {
    const challengeId = req.params.id;
    const userId = req.userInfo.userId;

    const challenge = await Challenge.findById(challengeId);
    if (!challenge || challenge.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found",
      });
    }

    if (!challenge.creator.equals(userId)) {
      return res.status(403).json({
        success: false,
        message: "Only the creator can update this challenge",
      });
    }

    const { title, description, dueDate, status,points,bonusPoints } = req.body;

    // Check if title is provided and not empty
    if (title !== undefined && title.trim() !== "") {
      challenge.title = title;
    }

    // Check if description is provided and not empty
    if (description !== undefined && description.trim() !== "") {
      challenge.description = description;
    }
    // Check if points is provided and valid
    if (points !== undefined && points > 0 && points <= 100 && Number.isInteger(points)) {
      challenge.points = points;
    }
    // Check if bonusPoints is provided and valid
    if (bonusPoints !== undefined && bonusPoints >= 0 && bonusPoints <= 100 && Number.isInteger(bonusPoints)) {
      challenge.bonusPoints = bonusPoints;
    }
    

    // Check if dueDate is provided and not empty, and also check if it's a valid future date
    if (dueDate !== undefined && dueDate.trim() !== "") {
      const dueDateObj = new Date(dueDate);
      if (!isNaN(dueDateObj)) {
        // If the dueDate is in the past, return an error
        if (dueDateObj < new Date()) {
          return res.status(400).json({
            success: false,
            message: "Due date cannot be in the past",
          });
        }
        challenge.dueDate = dueDateObj;
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid due date",
        });
      }
    }

    // Check if status is provided and valid
    if (
      status !== undefined &&
      status.trim() !== "" &&
      ["pending", "in-progress", "completed", "cancelled"].includes(status)
    ) {
      challenge.status = status;
    }

    await challenge.save();

    res.status(200).json({
      success: true,
      message: "Challenge updated successfully",
      challenge,
    });
  } catch (error) {
    console.error("Update Challenge Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating challenge",
    });
  }
};

const joinChallenges = async (req, res) => {
  try {
    const challengeId = req.params.id;
    const userId = req.userInfo.userId;

    // Find the challenge by its ID
    const challenge = await Challenge.findById(challengeId);
    if (!challenge || challenge.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found or already deleted",
      });
    }

    // Check if user is already a participant
    if (challenge.participants.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "You are already a participant in this challenge",
      });
    }

    // Add user to the participants list
    challenge.participants.push(userId);

    // Change status to "in-progress" if currently "pending"
    if (challenge.status === "pending" && challenge.participants.length > 1) {
      challenge.status = "in-progress";
    }

    await challenge.save();

    res.status(200).json({
      success: true,
      message: "You have successfully joined the challenge",
      challenge,
    });
  } catch (error) {
    console.error("Join Challenge Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error joining challenge",
    });
  }
};

const leaveChallenge = async (req, res) => {
  try {
    const challengeId = req.params.id;
    const userId = req.userInfo.userId;

    const challenge = await Challenge.findById(challengeId);
    if (!challenge || challenge.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found or already deleted",
      });
    }

    // Check if user is a participant
    const isParticipant = challenge.participants.includes(userId);
    if (!isParticipant) {
      return res.status(400).json({
        success: false,
        message: "You are not a participant in this challenge",
      });
    }

    // Remove user from participants
    challenge.participants = challenge.participants.filter(
      (participantId) => !participantId.equals(userId)
    );

    // Remove user progress if exists
    challenge.userProgress = challenge.userProgress.filter(
      (progress) => !progress.user.equals(userId)
    );

    // If no participants remain, reset status to pending
    if (challenge.participants.length <=1) {
      challenge.status = "pending";
    }

    await challenge.save();

    res.status(200).json({
      success: true,
      message: "You have left the challenge",
      challenge,
    });
  } catch (error) {
    console.error("Leave Challenge Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error leaving challenge",
    });
  }
};

const createChallengeProgress = async (req, res) => {
  try {
    const challengeId = req.params.id; // Now coming from URL
    const { completed, submissionLink, notes } = req.body;
    const userId = req.userInfo.userId;

    // Find the challenge
    const challenge = await Challenge.findById(challengeId);
    if (!challenge || challenge.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found or has been deleted",
      });
    }

    // Check if the user is a participant
    if (!challenge.participants.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: "You are not a participant in this challenge",
      });
    }

    const isCompleted = completed === true;
    let earnedPoints = challenge.points || 10;
    const bonusPoints = challenge.bonusPoints || 0;

    // Check if someone has already completed the challenge
    const someoneCompleted = challenge.userProgress.some((p) => p.completed);

    if (!someoneCompleted && isCompleted) {
      earnedPoints += bonusPoints; // first finisher gets bonus
    }

    const userProgress = {
      user: userId,
      completed: isCompleted,
      pointsEarned: isCompleted ? earnedPoints : 0,
      submissionLink: submissionLink?.trim() || "",
      notes: notes?.trim() || "",
      completedAt: isCompleted ? new Date() : null,
    };

    challenge.userProgress.push(userProgress);
    await challenge.save();

    res.status(200).json({
      success: true,
      message: "Progress submitted successfully",
      data: userProgress,
    });
  } catch (error) {
    console.error("Error in createChallengeProgress:", error);
    res.status(500).json({
      success: false,
      message: "Server error while submitting progress",
    });
  }
};

const updateChallengeProgress = async (req, res) => {
  try {
    const challengeId = req.params.id;
    const { completed, submissionLink, notes } = req.body;
    const userId = req.userInfo.userId;

    // Find the challenge by its ID
    const challenge = await Challenge.findById(challengeId);
    if (!challenge || challenge.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found or already deleted",
      });
    }

    // Check if the user is a participant in the challenge
    if (!challenge.participants.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "You are not a participant in this challenge",
      });
    }

    // Find the user's progress
    let userProgress = challenge.userProgress.find((progress) =>
      progress.user.equals(userId)
    );

    if (!userProgress) {
      return res.status(404).json({
        success: false,
        message: "No progress found for this user in this challenge",
      });
    }

    // Determine base and bonus points
    let earnedPoints = challenge.points || 10;
    const bonusPoints = challenge.bonusPoints || 0;

    const isCompleted = completed === true;

    if (isCompleted && !userProgress.completed) {
      // If completed status is set to true, update progress
      userProgress.completed = true;
      userProgress.completedAt = new Date();
      earnedPoints += bonusPoints; // add bonus points for first completer
    }

    // Update other fields if provided
    if (submissionLink?.trim())
      userProgress.submissionLink = submissionLink.trim();
    if (notes?.trim()) userProgress.notes = notes.trim();

    userProgress.pointsEarned = earnedPoints;

    // Save the updated challenge
    await challenge.save();

    res.status(200).json({
      success: true,
      message: "Challenge progress updated successfully",
      challenge,
    });
  } catch (error) {
    console.error("Update Challenge Progress Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating challenge progress",
    });
  }
};


const removeChallengeProgress = async (req, res) => {
  try {
    const challengeId = req.params.id;
    const userId = req.userInfo.userId;

    // Find the challenge
    const challenge = await Challenge.findById(challengeId);
    if (!challenge || challenge.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found or has been deleted",
      });
    }

    // Check if user is a participant
    if (!challenge.participants.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: "You are not a participant in this challenge",
      });
    }

    // Filter out the user's progress
    const originalLength = challenge.userProgress.length;
    challenge.userProgress = challenge.userProgress.filter(
      (progress) => !progress.user.equals(userId)
    );

    // If no change, then progress was not found
    if (challenge.userProgress.length === originalLength) {
      return res.status(404).json({
        success: false,
        message: "No progress found for this user to remove",
      });
    }

    await challenge.save();

    res.status(200).json({
      success: true,
      message: "User progress removed successfully",
    });
  } catch (error) {
    console.error("Error removing challenge progress:", error);
    res.status(500).json({
      success: false,
      message: "Server error while removing challenge progress",
    });
  }
};


const voteForParticipant = async (req, res) => {
  try {
    const challengeId = req.params.id;
    const { votedForId } = req.body;
    const userId = req.userInfo.userId;

    const challenge = await Challenge.findById(challengeId);
    if (!challenge || challenge.isDeleted) {
      return res
        .status(404)
        .json({ success: false, message: "Challenge not found" });
    }
    if (challenge.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Voting is closed because the challenge is completed",
      });
    }
    if (userId === votedForId) {
      return res
        .status(400)
        .json({ success: false, message: "You cannot vote for yourself" });
    }

    if (!challenge.participants.includes(votedForId)) {
      return res.status(400).json({
        success: false,
        message: "Selected user is not a participant",
      });
    }

    const votedUserProgress = challenge.userProgress.find(
      (progress) =>
        progress.user.toString() === votedForId && progress.completed === true
    );

    if (!votedUserProgress) {
      return res.status(400).json({
        success: false,
        message: "You can only vote for users who have completed the challenge",
      });
    }

    const existingVoteIndex = challenge.votes.findIndex(
      (v) => v.voter.toString() === userId
    );

    // If user already voted
    if (existingVoteIndex !== -1) {
      const previousVotedForId =
        challenge.votes[existingVoteIndex].votedFor.toString();
      const prevProgress = challenge.userProgress.find(
        (p) => p.user.toString() === previousVotedForId
      );

      // Remove point from previously voted user
      if (prevProgress && prevProgress.pointsEarned > 0) {
        prevProgress.pointsEarned -= 1;
      }

      challenge.votes.splice(existingVoteIndex, 1); // Remove old vote

      // If clicked again on same user → just unvote (toggle off)
      if (previousVotedForId === votedForId) {
        challenge.evaluationMethod =
          challenge.votes.length > 0 ? "vote" : "auto";
        await challenge.save();
        return res.status(200).json({
          success: true,
          message: "Vote removed (toggled off)",
          challenge,
        });
      }
    }

    // Vote for the new user
    challenge.votes.push({ voter: userId, votedFor: votedForId });
    votedUserProgress.pointsEarned += 1;

    // Update evaluation method
    challenge.evaluationMethod = challenge.votes.length > 0 ? "vote" : "auto";

    await challenge.save();

    res.status(200).json({
      success: true,
      message: "Vote submitted (or changed)",
      challenge,
    });
  } catch (error) {
    console.error("Vote error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error while voting" });
  }
};

const ChallengeWinner = async (req, res) => {
  try {
    const challengeId = req.params.id;

    const challenge = await Challenge.findById(challengeId);
    if (!challenge || challenge.isDeleted) {
      return res
        .status(404)
        .json({ success: false, message: "Challenge not found" });
    }

    const now = new Date();

    // If due date hasn't passed yet
    if (challenge.dueDate > now) {
      return res
        .status(400)
        .json({ success: false, message: "Challenge is still active" });
    }

    // Prevent duplicate finalization
    if (challenge.status === "completed" && challenge.winner) {
      return res.status(400).json({
        success: false,
        message: "Challenge has already been finalized.",
        winner: challenge.winner,
      });
    }

    // Mark as completed if not already
    if (challenge.status !== "completed") {
      challenge.status = "completed";
    }

    // Filter completed participants
    const completedUsers = challenge.userProgress.filter((p) => p.completed);

    if (completedUsers.length === 0) {
      challenge.status = "cancelled";
      await challenge.save();
      return res.status(400).json({
        success: false,
        message:
          "No participants completed the challenge. Challenge is cancelled.",
      });
    }

    // Sort by points then by earliest completion
    completedUsers.sort((a, b) => {
      if (b.pointsEarned !== a.pointsEarned) {
        return b.pointsEarned - a.pointsEarned; // More points first
      }
      return new Date(a.completedAt || 0) - new Date(b.completedAt || 0); // Earlier wins tie
    });

    const winnerProgress = completedUsers[0];
    const winnerUserId = winnerProgress.user;
    const winnerPoints = winnerProgress.pointsEarned;

    // Set winner in challenge
    challenge.winner = winnerUserId;

    // Award points to all completed users
    for (const progress of completedUsers) {
      const user = await User.findById(progress.user);
      if (user) {
        user.points = (user.points || 0) + progress.pointsEarned;
        await user.save();
      }
    }

    await challenge.save();

    res.status(200).json({
      success: true,
      message: "Challenge completed and points awarded to all participants.",
      winner: winnerUserId,
      pointsAwarded: winnerPoints,
      evaluationMethod: challenge.evaluationMethod,
    });
  } catch (error) {
    console.error("Error finalizing challenge:", error);
    res.status(500).json({
      success: false,
      message: "Server error while finalizing challenge",
    });
  }
};


// const  flagChallenge=async(req,res)=>{
//     try{

//     }catch(error){

//     }
// }

const myParticipantChallenges = async (req, res) => {
  try {
    const userId = req.userInfo.userId;

    const challenges = await Challenge.find({
      participants: userId,
      isDeleted: false,
    })
      .sort({ dueDate: -1 })
      .populate("creator", "username profileImage")
      .populate("winner", "username profileImage")
      .populate("participants", "username points");

    if (!challenges || challenges.length === 0) {
      return res.status(200).json({
        success: false,
        message: "You have not joined any challenges yet",
      });
    }

    res.status(200).json({
      success: true,
      message: "challenge found successfully",
      challenges,
    });
  } catch (error) {
    console.error("Error fetching participant challenges:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const softDeleteChallenges = async (req, res) => {
  try {
    const challengeId = req.params.id;
    const userId = req.userInfo.userId;

    const challenge = await Challenge.findById(challengeId);

    if (!challenge || challenge.isDeleted) {
      return res
        .status(404)
        .json({ success: false, message: "Challenge not found" });
    }

    // Optional: Only the creator can delete
    if (!challenge.creator.equals(userId)) {
      return res.status(403).json({
        success: false,
        message: "Only the creator can soft delete this challenge",
      });
    }

    challenge.isDeleted = true;
    await challenge.save();

    res
      .status(200)
      .json({ success: true, message: "Challenge soft-deleted successfully" });
  } catch (error) {
    console.error("Soft delete error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while soft-deleting challenge",
    });
  }
};

const getAllSoftDeletedChallenges = async (req, res) => {
  try {
     const userId = req.userInfo.userId;
    const challenges = await Challenge.find({ isDeleted: true , creator:userId }) // include soft-deleted
      .populate("creator", "username profileImage") // optional: include creator info
      .populate("participants", "username points") // optional
      .sort({ createdAt: -1 }); // latest first
    if (!challenges || challenges.length === 0) {
      return res.status(200).json({
        success: true,
        challenges: [],
        message: "No challenges found",
      });
    }

    res.status(200).json({
      success: true,
      challenges,
    });
  } catch (error) {
    console.error("Get All Challenges Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching challenges",
    });
  }
};

const recoverSoftDeletedChallenge = async (req, res) => {
  try {
    const { id } = req.params;
     const userId = req.userInfo.userId;
    // Find the challenge by ID
    const challenge = await Challenge.findById(id);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found",
      });
    }

    if (!challenge.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "Challenge is already active",
      });
    }
      if (!challenge.creator.equals(userId)) {
      return res.status(403).json({
        success: false,
        message: "Only the creator can recover deleted  challenge",
      });
    }

    // Recover (undo soft-delete)
    challenge.isDeleted = false;
    await challenge.save();

    res.status(200).json({
      success: true,
      message: "Challenge has been successfully recovered",
      challenge,
    });
  } catch (error) {
    console.error("Recover Challenge Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error recovering challenge",
    });
  }
};

module.exports = {
  createChallenge,
  deleteChallenge,
  getAllChallenges,
  getSingleChallenge,
  updateChallenge,
  joinChallenges,
  leaveChallenge,
  createChallengeProgress,
  updateChallengeProgress,
  voteForParticipant,
  ChallengeWinner,
  myParticipantChallenges,
  softDeleteChallenges,
  getAllSoftDeletedChallenges,
  recoverSoftDeletedChallenge,
  removeChallengeProgress
};
