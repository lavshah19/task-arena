const User = require("../models/User");
const Challenge = require("../models/Challenge");



const getDashboardStats = async (req, res) => {
  try {
    const userId = req.userInfo.userId; // from auth middleware
    const role = req.userInfo.role;

    if (role === "admin") {
      // Admin: global stats
      const totalUsers = await User.countDocuments();
      const totalAdmins = await User.countDocuments({ role: "admin" });
      const totalRegularUsers = await User.countDocuments({ role: "user" });
      const usersWithCompleteProfile = await User.countDocuments({ isProfileComplete: true });
      const totalPoints = await User.aggregate([
        { $group: { _id: null, totalPoints: { $sum: "$points" } } },
      ]);

      const followersData = await User.aggregate([
        { $project: { username: 1, followersCount: { $size: "$followers" }, followingCount: { $size: "$following" } } }
      ]);

      const totalChallenges = await Challenge.countDocuments();
      const challengesByStatus = await Challenge.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]);

      const totalVotes = await Challenge.aggregate([
        { $unwind: "$votes" },
        { $group: { _id: null, totalVotes: { $sum: 1 } } },
      ]);

      return res.json({
        role,
        users: {
          totalUsers,
          totalAdmins,
          totalRegularUsers,
          usersWithCompleteProfile,
          totalPoints: totalPoints[0]?.totalPoints || 0,
          followersData,
        },
        challenges: {
          totalChallenges,
          challengesByStatus,
          totalVotes: totalVotes[0]?.totalVotes || 0,
        },
      });
    } else {
      // Regular user: personal stats
      const user = await User.findById(userId).select("username points followers following isProfileComplete");

      const userChallenges = await Challenge.find({
        participants: userId
      }).select("title status points bonusPoints createdAt");

      const totalVotes = await Challenge.aggregate([
        { $unwind: "$votes" },
        { $match: { "votes.votedFor": userId } },
        { $group: { _id: null, votesReceived: { $sum: 1 } } },
      ]);

      return res.json({
        role,
        user,
        challenges: {
          participated: userChallenges,
          votesReceived: totalVotes[0]?.votesReceived || 0,
        },
      });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
};




module.exports = {
  getDashboardStats,
};
