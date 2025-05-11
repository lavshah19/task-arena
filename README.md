🏟️ Task Arena
Task Arena is a full-stack productivity web app that combines challenge-based goal tracking with a robust personal task manager. It helps users stay organized, compete with others, and build habits through challenges — all in one clean and powerful interface.

🚀 Features
🔥 Challenge Arena
Create Public Challenges with titles, descriptions, points, and optional bonus points.

Join or Leave Challenges at any time.

Submit Challenge Progress, which can be updated or deleted.

Voting System: Users can vote on submissions. Each vote = 1 point.

Leaderboard & Winner Display: After the challenge ends, the user with the most points is declared the winner.

Edit Challenges: Creators can update or soft-delete their challenges.

Soft Delete & Recovery: Challenges can be restored or permanently deleted later.

My Challenges: View all challenges you’ve created or joined.

Top Users Leaderboard: Ranks users based on total points from all challenges.

✅ Personal Task Manager
Create Tasks with title, description, due date, priority, and tags.

Due Date Lock: Option to lock due date from editing.

Edit or Update Tasks anytime.

Mark as Complete or Pending to track status.

Soft Delete & Recycle Bin: Tasks can be temporarily deleted and recovered later.

Permanent Deletion: Fully remove tasks when no longer needed.

Real-Time Countdown: Live timer shows how much time is left until due.

Organize with Tags: Categorize tasks for better focus.

🛠️ Tech Stack
Frontend:

React

Tailwind CSS

React Router

Axios

Backend:

Node.js

Express.js

MongoDB

Mongoose

Authentication:

JWT (JSON Web Token)

Context API for auth state

Other Libraries:

bcrypt

multer

dayjs

📦 Getting Started
Clone the Repository
git clone https://github.com/your-username/task-arena.git
cd task-arena

Backend Setup

cd backend
npm install
npm run dev

Frontend Setup
cd frontend
npm install
npm run dev

🔐 Environment Variables
Before running the project, create a .env file in the root directory and add the following environment variables:

PORT=3000
MONGOOSE_URL=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
JWT_SECRET_KEY=your_jwt_secret_key

VITE_API_URL=http://localhost:3000/api  //for frontend .env

🔐 Auth & Access
JWT tokens are used for protected routes and authentication.

Users must log in to create/join challenges, manage tasks, and vote.

🏆 Leaderboard
Displays top 10 users with the highest accumulated points.

Each leaderboard item includes: username, profile image, and total points.

Automatically filters out banned accounts.

🤝 Contributions
Got ideas or improvements? Feel free to fork, open issues, or submit a pull request!

📄 License
This project is licensed under the MIT License.

