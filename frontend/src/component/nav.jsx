import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../component/context/AuthContext'; 
import axios from 'axios';
import { 
  Menu, 
  X, 
  Home, 
  Award, 
  CheckSquare, 
  LogIn, 
  UserPlus, 
  LogOut,
  User,
  Trophy,
  BarChart,
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);
  const baseUrl = import.meta.env.VITE_API_URL;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    if (token) {
      axios.get(`${baseUrl}/auth/get-user-info`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      .then((response) => {
        setUser(response.data.user);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
    }
  }, [token]);

  return (
    <nav className="bg-white border-b shadow-md sticky  top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo (Home) */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-blue-600 hover:text-blue-700 transition duration-150">
              <Home size={24} />
              <span>TaskArena</span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
             <Link to="/leaderboard" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition duration-150">
              <Trophy size={18} />
              <span>Leaderboard</span>
            </Link>
            <Link to="/challenges" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition duration-150">
              <Award size={18} />
              <span>Challenges</span>
            </Link>
            <Link to="/tasks" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition duration-150">
              <CheckSquare size={18} />
              <span>Tasks</span>
            </Link>

            {!token ? (
              <>
                <Link to="/login" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition duration-150">
                  <LogIn size={18} />
                  <span>Login</span>
                </Link>
                <Link to="/register" className="flex items-center space-x-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-150">
                  <UserPlus size={18} />
                  <span>Register</span>
                </Link>
              </>
            ) : (
              <>
                <Link to="/profile" className="flex items-center space-x-2 hover:text-blue-600 transition duration-150">
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt="Profile"
                      className="w-8 h-8 rounded-full border-2 border-blue-200"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <User size={16} className="text-blue-500" />
                    </div>
                  )}
                  <span className="text-gray-700">{user?.username}</span>
                </Link>
                <Link to="/dashboard" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition duration-150">
                  <BarChart size={18} />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-red-500 hover:text-red-700 transition duration-150"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-gray-700 hover:text-blue-600 focus:outline-none transition duration-150">
              {isOpen ? (
                <X size={24} />
              ) : (
                <Menu size={24} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 pt-2 space-y-3 bg-white border-t border-gray-100">
            <Link to="/leaderboard" className="flex items-center space-x-2 py-2 text-gray-700 hover:text-blue-600 transition duration-150">
            <Trophy size={18} />
            <span>Leaderboard</span>
          </Link>
          <Link to="/challenges" className="flex items-center space-x-2 py-2 text-gray-700 hover:text-blue-600 transition duration-150">
            <Award size={18} />
            <span>Challenges</span>
          </Link>
          <Link to="/tasks" className="flex items-center space-x-2 py-2 text-gray-700 hover:text-blue-600 transition duration-150">
            <CheckSquare size={18} />
            <span>Tasks</span>
          </Link>

          {!token ? (
            <>
              <Link to="/login" className="flex items-center space-x-2 py-2 text-gray-700 hover:text-blue-600 transition duration-150">
                <LogIn size={18} />
                <span>Login</span>
              </Link>
              <Link to="/register" className="flex items-center space-x-2 py-2 text-gray-700 hover:text-blue-600 transition duration-150">
                <UserPlus size={18} />
                <span>Register</span>
              </Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="flex items-center space-x-2 py-2 hover:text-blue-600 transition duration-150">
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="Profile"
                    className="w-8 h-8 rounded-full border-2 border-blue-200"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <User size={16} className="text-blue-500" />
                  </div>
                )}
                <span className="text-gray-700">{user?.username}</span>
              </Link>
              <Link to="/dashboard" className="flex items-center space-x-2 py-2 text-gray-700 hover:text-blue-600 transition duration-150">
                <BarChart size={18} />
                <span>Dashboard</span>
              </Link>
                  <button
                onClick={handleLogout}
                className="flex items-center space-x-2 py-2 text-red-500 hover:text-red-700 transition duration-150"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;