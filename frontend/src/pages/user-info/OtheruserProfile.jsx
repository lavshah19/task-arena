import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../component/context/AuthContext';
import { useNavigate,Link } from 'react-router-dom';
import { useParams } from "react-router-dom";

import { 
  Edit2, 
  User2, 
  Mail, 
  Shield, 
  MessageCircle, 
  Award, 
  Github, 
  Twitter, 
  CheckCircle, 
  XCircle, 
  Loader,
  UserPlus,
  UserMinus,
  Users
} from 'lucide-react';

const OtheruserProfile = () => {
  const { token,user } = useAuth();
  const [User, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const navigate = useNavigate();
  const { id } = useParams();
  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`${baseUrl}/auth/get-other-user-info/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data.user);
        setFollowersCount(res.data.followersCount);
        setFollowingCount(res.data.followingCount);
        
        // Check if current user is following this user
        if (res.data.user.followers && user?._id) {
          setIsFollowing(res.data.user.followers.includes(user._id));
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token, id, user?._id]);

  const handleFollowToggle = async () => {
    if (followLoading) return;
    
    setFollowLoading(true);
    try {
      const res = await axios.put(`${baseUrl}/auth/toggle-followers/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (res.data.success) {
        setIsFollowing(res.data.isFollowing);
        setFollowersCount(res.data.followersCount);
      }
    } catch (err) {
      console.error('Error toggling follow:', err);
      setError(err.response?.data?.message || 'Failed to update follow status');
    } finally {
      setFollowLoading(false);
    }
  };

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
      
      {/* Action Buttons */}
      <div className="absolute top-4 right-4 flex gap-2">
        {User._id === user._id ? (
          <Link
            to="/profile-edit"
            className="bg-white text-blue-600 px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-blue-50 transition duration-150 shadow-md cursor-pointer"
          >
            <Edit2 size={16} />
            <span>Edit Profile</span>
          </Link>
        ) : (
          <button
            onClick={handleFollowToggle}
            disabled={followLoading}
            className={`px-4 py-2 rounded-lg flex items-center gap-1 transition duration-150 shadow-md font-medium ${
              isFollowing
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            } ${followLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {followLoading ? (
              <Loader size={16} className="animate-spin" />
            ) : isFollowing ? (
              <UserMinus size={16} />
            ) : (
              <UserPlus size={16} />
            )}
            <span>{followLoading ? 'Loading...' : isFollowing ? 'Unfollow' : 'Follow'}</span>
          </button>
        )}
      </div>



      {/* Profile header with image */}
      <div className="relative pt-16 mb-8">
        <div className="absolute left-1/2 transform -translate-x-1/2 -top-12">
          <div className="rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
            
              <img
                src={User.profileImage || `https://api.dicebear.com/9.x/adventurer/svg?seed=${user.username}`}
                alt="Profile"
                className="w-24 h-24 object-cover"
              />
          
          </div>
        </div>
        
        <div className="text-center pt-14">
          <h2 className="text-2xl font-bold text-gray-800">{User.username}</h2>
          <div className="flex items-center justify-center mt-1 text-gray-600">
            <Mail size={16} className="mr-1" />
            <p>{User.email}</p>
          </div>
          <div className="flex items-center justify-center mt-1 text-gray-500">
            <Shield size={16} className="mr-1" />
            <p className="capitalize">Role: {User.role}</p>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-xl flex items-center space-x-3">
          <Award size={24} className="text-blue-600" />
          <div>
            <p className="text-xs text-gray-500 uppercase font-medium">Points</p>
            <p className="text-xl font-bold text-blue-600">{User.points}</p>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-xl flex items-center space-x-3">
          <CheckCircle size={24} className={User.isProfileComplete ? 'text-green-600' : 'text-yellow-500'} />
          <div>
            <p className="text-xs text-gray-500 uppercase font-medium">Profile Status</p>
            <p className={`font-medium ${User.isProfileComplete ? 'text-green-600' : 'text-yellow-500'}`}>
              {User.isProfileComplete ? 'Complete' : 'Incomplete'}
            </p>
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-xl flex items-center space-x-3">
          <Users size={24} className="text-purple-600" />
          <div>
            <p className="text-xs text-gray-500 uppercase font-medium">Followers</p>
            <p className="text-xl font-bold text-purple-600">{followersCount}</p>
          </div>
        </div>
        <div className="bg-orange-50 p-4 rounded-xl flex items-center space-x-3">
          <User2 size={24} className="text-orange-600" />
          <div>
            <p className="text-xs text-gray-500 uppercase font-medium">Following</p>
            <p className="text-xl font-bold text-orange-600">{followingCount}</p>
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
          {User.bio || 'No bio information provided yet.'}
        </p>
      </div>

      {/* Social links */}
      {(User.socialLinks?.github || User.socialLinks?.twitter) && (
        <div className="flex flex-wrap gap-3 mb-6">
          {User.socialLinks?.github && (
            <a
              href={User.socialLinks.github}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition duration-150"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github size={18} />
              <span>GitHub</span>
            </a>
          )}
          {User.socialLinks?.twitter && (
            <a
              href={User.socialLinks.twitter}
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
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${User.isBanned ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
            {User.isBanned ? 'Banned' : 'Active'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OtheruserProfile;