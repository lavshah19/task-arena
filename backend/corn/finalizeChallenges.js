const cron = require('node-cron');
const Challenge = require('../models/Challenge');
const User = require('../models/User');

function finalizeChallenges() {
  cron.schedule('* * * * *', async () => {
    console.log('Checking for expired challenges...');

    const now = new Date();

    try {
      const expiredChallenges = await Challenge.find({
        status: { $ne: 'completed' },
        dueDate: { $lte: now },
        isDeleted: false,
      });

      for (const challenge of expiredChallenges) {
        // console.log(`Finalizing challenge: ${challenge._id}`);

        if (challenge.status === 'completed' && challenge.winner) continue;

        const completedUsers = challenge.userProgress.filter((p) => p.completed);

        if (completedUsers.length === 0) {
          challenge.status = 'cancelled';
          await challenge.save();
        //   console.log(`Challenge ${challenge._id} cancelled.`);
          continue;
        }

        completedUsers.sort((a, b) => {
          if (b.pointsEarned !== a.pointsEarned) {
            return b.pointsEarned - a.pointsEarned;
          }
          return new Date(a.completedAt || 0) - new Date(b.completedAt || 0);
        });

        const winnerProgress = completedUsers[0];
        const winnerUserId = winnerProgress.user;

        challenge.status = 'completed';
        challenge.winner = winnerUserId;

        for (const progress of completedUsers) {
          const user = await User.findById(progress.user);
          if (user) {
            user.points = (user.points || 0) + progress.pointsEarned;
            await user.save();
          }
        }

        await challenge.save();
        // console.log(`Challenge ${challenge._id} completed. Winner: ${winnerUserId}`);
      }
    } catch (err) {
      console.error('Error finalizing challenges:', err);
    }
  });
}

module.exports = finalizeChallenges;
