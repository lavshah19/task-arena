import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../component/context/AuthContext';
import {
  Save,
  AlertCircle,
  ArrowLeft,
  MessageCircle,
  Github,
  Twitter,
  Upload,
  User
} from 'lucide-react';

const UserProfileEdit = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [bio, setBio] = useState('');
  const [github, setGithub] = useState('');
  const [twitter, setTwitter] = useState('');
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get(`${baseUrl}/auth/get-user-info`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = res.data.user;
        setBio(user.bio || '');
        setGithub(user.socialLinks.github || '');
        setTwitter(user.socialLinks.twitter || '');
        if (user.profileImage) {
          setPreviewImage(user.profileImage);
        }
      } catch (err) {
        setError('Failed to load user info');
      }
    };

    fetchUserInfo();
  }, [token]);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('bio', bio);
    formData.append('github', github);
    formData.append('twitter', twitter);
    if (image) {
      formData.append('profileImage', image);
    }

    try {
      setIsLoading(true);
      await axios.put(`${baseUrl}/auth/profile`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setIsLoading(false);
      navigate('/profile');
    } catch (err) {
      setIsLoading(false);

      setError(err.response?.data?.message || 'Error updating profile');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4 py-12">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={18} className="mr-1" />
            <span>Back</span>
          </button>
          <h2 className="text-2xl font-bold text-blue-600">
            Edit Profile
          </h2>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 rounded flex items-start">
            <AlertCircle size={18} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-blue-50 flex items-center justify-center border-2 border-blue-100">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={40} className="text-blue-300" />
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <MessageCircle size={16} className="mr-1 text-blue-500" />
              Bio
            </label>
            <textarea
              placeholder="Tell others about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition"
              rows={4}
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <Github size={16} className="mr-1 text-gray-700" />
              GitHub Profile URL
            </label>
            <input
              type="text"
              placeholder="https://github.com/yourusername"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition"
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <Twitter size={16} className="mr-1 text-blue-400" />
              Twitter Profile URL
            </label>
            <input
              type="text"
              placeholder="https://twitter.com/yourusername"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition"
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <Upload size={16} className="mr-1 text-blue-500" />
              Profile Image
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="profile-image"
              />
              <label htmlFor="profile-image" className="cursor-pointer">
                <div className="flex flex-col items-center text-gray-500 hover:text-blue-500 transition">
                  <Upload size={24} className="mb-2" />
                  <span className="text-sm font-medium">
                    {image ? image.name : 'Click to upload an image'}
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    JPG, PNG or GIF, Max 2MB
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center font-medium"
            >
              <Save size={18} className="mr-2" />
              {isLoading?"saving profile":"Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfileEdit;
