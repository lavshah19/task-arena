import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './component/context/AuthContext';
import Navbar from './component/nav';
import Home from './pages/Home';
import Login from './pages/auth-page/Login';
import Register from './pages/auth-page/Register';
import UserProfileEdit from './pages/user-info/UserProfileEdit';
import Challenges from './component/challenges/Challenges';
import Task from './component/tasks/Task';
import Profile from './pages/user-info/Profile';
import MyTasks from './component/tasks/MyTasks';
import EditTask from './component/tasks/EditTask';
import CreateTask from './component/tasks/CreateTask';
import RecycleTasks from './component/tasks/RecycleTasks';
import CreateChallenge from './component/challenges/CreateChallenge';
import ChallengeArena from './component/challenges/ChallengeArena';
import UpdateChallenge from './component/challenges/UpdateChallenge';
import ChallengeInfo from './component/challenges/ChallengeInfo';
import MyparticipantChallenge from './component/challenges/MyparticipantChallenge';
import DeleteChallenge from './component/challenges/DeleteChallenge';
import OtheruserProfile from './pages/user-info/OtheruserProfile';
import Leaderboard from './component/Leaderboard';
import PrivateChallengeJoin from './component/challenges/private/PrivateChallengeJoin';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { token } = useAuth();

  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={!token ? <Login /> : <Navigate to="/" replace />}
        />
        <Route
          path="/register"
          element={!token ? <Register /> : <Navigate to="/" replace />}
        />

        {/* Protected Routes */}
        <Route
          path="/profile-edit"
          element={token ? <UserProfileEdit /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/challenges"
          element={token ? <Challenges /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/tasks"
          element={token ? <Task /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/profile"
          element={token ? <Profile /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/mytask"
          element={token ? <MyTasks /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/edittask/:id"
          element={token ? <EditTask /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/createtask"
          element={token ? <CreateTask /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/recycletask"
          element={token ? <RecycleTasks /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/createchallenge"
          element={token ? <CreateChallenge /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/challengearena"
          element={token ? <ChallengeArena /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/updatechallenge/:id"
          element={token ? <UpdateChallenge /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/challengeinfo/:id"
          element={token ? <ChallengeInfo /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/mychallenges"
          element={token ? <MyparticipantChallenge /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/deletechallenges"
          element={token ? <DeleteChallenge /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/profile/:id"
          element={token ? <OtheruserProfile /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/leaderboard"
          element={token ? <Leaderboard /> : <Navigate to="/login" replace />}
        />
           <Route
          path="/join-private/:inviteCode"
          element={token ? <PrivateChallengeJoin /> : <Navigate to="/login" replace />}
        />
      </Routes>
       <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
      />
    </div>
  );
}

export default App;
