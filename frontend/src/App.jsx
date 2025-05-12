import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/auth-page/Register';
import Login from './pages/auth-page/Login';
import Navbar from './component/nav';
import UserProfileEdit from './pages/user-info/UserProfileEdit';
import { useAuth } from './component/context/AuthContext';
import { jwtDecode } from 'jwt-decode'; // use named import
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
import { Loader } from 'lucide-react';
 
function App() {
  const { token } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
 const [loading, setLoading] = useState(true);
  useEffect(() => {
    const checkAuth = () => {
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          if (decoded.exp > currentTime) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        } catch (err) {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false); // finish checking
    };

    checkAuth();
  }, [token]);

    if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader className="w-10 h-10 text-blue-600 animate-spin" />
      <span className="ml-3 text-lg font-medium text-gray-700">Loading challenges...</span>
    </div>
  );

  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Login and Register only for guests */}
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />}
        />
        <Route
          path="/register"
          element={!isAuthenticated ? <Register /> : <Navigate to="/" replace />}
        />

        {/* Protected route */}
        <Route
          path="/profile-edit"
          element={isAuthenticated ? <UserProfileEdit /> : <Navigate to="/login" replace />}
        />
      
      <Route
          path="/challenges"
          element={isAuthenticated ? <Challenges /> : <Navigate to="/login" replace />}
        />

<Route
          path="/tasks"
          element={isAuthenticated ? <Task /> : <Navigate to="/login" replace />}
        />

<Route
          path="/profile"
          element={isAuthenticated ? <Profile /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/mytask"
          element={isAuthenticated ? <MyTasks /> : <Navigate to="/login" replace />}
        />

          <Route
          path="/edittask/:id"
          element={isAuthenticated ? <EditTask /> : <Navigate to="/login" replace />}
        />
         <Route
          path="/createtask"
          element={isAuthenticated ? <CreateTask /> : <Navigate to="/login" replace />}
        />
         <Route
          path="/recycletask"
          element={isAuthenticated ? <RecycleTasks /> : <Navigate to="/login" replace />}
        />
            <Route
          path="/createchallenge"
          element={isAuthenticated ? <CreateChallenge /> : <Navigate to="/login" replace />}
        />
              <Route
          path="/challengearena"
          element={isAuthenticated ? <ChallengeArena /> : <Navigate to="/login" replace />}
        />
                 <Route
          path="/updatechallenge/:id"
          element={isAuthenticated ? <UpdateChallenge /> : <Navigate to="/login" replace />}
        />
                <Route
          path="/challengeinfo/:id"
          element={isAuthenticated ? <ChallengeInfo /> : <Navigate to="/login" replace />}
        />
                    <Route
          path="/mychallenges"
          element={isAuthenticated ? <MyparticipantChallenge /> : <Navigate to="/login" replace />}
        />
                     <Route
          path="/deletechallenges"
          element={isAuthenticated ? <DeleteChallenge /> : <Navigate to="/login" replace />}
        />
                       <Route
          path="/profile/:id"
          element={isAuthenticated ? <OtheruserProfile /> : <Navigate to="/login" replace />}
        />

                        <Route
          path="/leaderboard"
          element={isAuthenticated ? <Leaderboard /> : <Navigate to="/login" replace />}
        />

        
      </Routes>
    </div>
  );
}

export default App;
