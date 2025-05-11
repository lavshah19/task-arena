import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../component/context/AuthContext';
import { useNavigate,Link } from 'react-router-dom';

import { 
  Edit2, 
  User, 
  Mail, 
  Shield, 
  MessageCircle, 
  Award, 
  Github, 
  Twitter, 
  CheckCircle, 
  XCircle, 
  Loader
} from 'lucide-react';

const Profile = () => {
  const { token } = useAuth();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`${baseUrl}/auth/get-user-info`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data.user);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center flex flex-col items-center space-y-4">
        <Loader size={36} className="text-blue-600 animate-spin" />
        <p className="text-blue-600 font-medium">Loading profile...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="max-w-3xl mx-auto mt-20 p-8 bg-red-50 rounded-xl shadow-md">
      <div className="text-center py-10 text-red-500 flex flex-col items-center">
        <XCircle size={36} className="mb-2" />
        <p className="font-medium text-lg">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-8 mt-16 bg-white rounded-xl shadow-lg border border-gray-100 relative">
      {/* Background header */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-xl"></div>
      
      {/* Edit Button */}
     


<Link
  to="/profile-edit"
  className="absolute top-4 right-4 bg-white text-blue-600 px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-blue-50 transition duration-150 shadow-md cursor-pointer"
>
  <Edit2 size={16} />
  <span>Edit Profile</span>
</Link>


      {/* Profile header with image */}
      <div className="relative pt-16 mb-8">
        <div className="absolute left-1/2 transform -translate-x-1/2 -top-12">
          <div className="rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt="Profile"
                className="w-24 h-24 object-cover"
              />
            ) : (
              <div className="w-24 h-24 bg-blue-100 flex items-center justify-center">
                <User size={36} className="text-blue-500" />
              </div>
            )}
          </div>
        </div>
        
        <div className="text-center pt-14">
          <h2 className="text-2xl font-bold text-gray-800">{user.username}</h2>
          <div className="flex items-center justify-center mt-1 text-gray-600">
            <Mail size={16} className="mr-1" />
            <p>{user.email}</p>
          </div>
          <div className="flex items-center justify-center mt-1 text-gray-500">
            <Shield size={16} className="mr-1" />
            <p className="capitalize">Role: {user.role}</p>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-xl flex items-center space-x-3">
          <Award size={24} className="text-blue-600" />
          <div>
            <p className="text-xs text-gray-500 uppercase font-medium">Points</p>
            <p className="text-xl font-bold text-blue-600">{user.points}</p>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-xl flex items-center space-x-3">
          <CheckCircle size={24} className={user.isProfileComplete ? 'text-green-600' : 'text-yellow-500'} />
          <div>
            <p className="text-xs text-gray-500 uppercase font-medium">Profile Status</p>
            <p className={`font-medium ${user.isProfileComplete ? 'text-green-600' : 'text-yellow-500'}`}>
              {user.isProfileComplete ? 'Complete' : 'Incomplete'}
            </p>
          </div>
        </div>
      </div>

      {/* Bio section */}
      <div className="bg-gray-50 p-5 rounded-xl mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <MessageCircle size={18} className="text-gray-600" />
          <h3 className="font-medium text-gray-700">Bio</h3>
        </div>
        <p className="text-gray-600 pl-6">
          {user.bio || 'No bio information provided yet.'}
        </p>
      </div>

      {/* Social links */}
      {(user.socialLinks?.github || user.socialLinks?.twitter) && (
        <div className="flex flex-wrap gap-3 mb-6">
          {user.socialLinks?.github && (
            <a
              href={user.socialLinks.github}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition duration-150"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github size={18} />
              <span>GitHub</span>
            </a>
          )}
          {user.socialLinks?.twitter && (
            <a
              href={user.socialLinks.twitter}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition duration-150"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter size={18} />
              <span>Twitter</span>
            </a>
          )}
        </div>
      )}

      {/* Account status */}
      <div className="border-t border-gray-100 pt-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center space-x-2">
            <Shield size={18} className="text-gray-600" />
            <span className="text-gray-600">Account Status</span>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${user.isBanned ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
            {user.isBanned ? 'Banned' : 'Active'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Profile;