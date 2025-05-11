import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../component/context/AuthContext';
import { 
  Trophy, 
  Calendar, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  ArrowLeft, 
  Award, 
  Star, 
  Loader2 
} from 'lucide-react';

const CreateChallenge = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [points, setPoints] = useState('');
  const [bonusPoints, setBonusPoints] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { token } = useAuth();
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await axios.post(
        `${baseUrl}/challenge/create`,
        {
          title,
          description,
          dueDate,
          points: Number(points),
          bonusPoints: Number(bonusPoints),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess('Challenge created successfully!');
      setTitle('');
      setDescription('');
      setDueDate('');
      setPoints('');
      setBonusPoints('');
      setTimeout(() => navigate('/challenges'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create challenge');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg mt-10 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-blue-700 flex items-center">
          <Trophy className="mr-2" size={24} />
          Create New Challenge
        </h2>
        <button 
          onClick={() => navigate('/challenges')}
          className="flex items-center text-gray-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft size={18} className="mr-1" />
          Back to Challenges
        </button>
      </div>

      {error && (
        <div className="flex items-center bg-red-50 text-red-700 p-3 rounded-lg mb-6">
          <AlertCircle size={20} className="mr-2 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-center bg-green-50 text-green-700 p-3 rounded-lg mb-6">
          <CheckCircle size={20} className="mr-2 flex-shrink-0" />
          <p>{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1">
          <label className="block font-medium text-gray-700 md:flex  items-center">
            <FileText size={16} className="mr-2" />
            Challenge Title
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a catchy title"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="block font-medium text-gray-700 md:flex  items-center">
            <FileText size={16} className="mr-2" />
            Description
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            rows="5"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the challenge details and requirements"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <label className="block font-medium text-gray-700 md:flex items-center">
              <Calendar size={16} className="mr-2" />
              Due Date
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block font-medium text-gray-700 md:flex  items-center">
              <Award size={16} className="mr-2" />
              Points
            </label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              placeholder="100"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block font-medium text-gray-700 md:flex items-center">
              <Star size={16} className="mr-2" />
              Bonus Points
            </label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={bonusPoints}
              onChange={(e) => setBonusPoints(e.target.value)}
              placeholder="25"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center font-medium disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Trophy size={18} className="mr-2" />
                Create Challenge
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateChallenge;