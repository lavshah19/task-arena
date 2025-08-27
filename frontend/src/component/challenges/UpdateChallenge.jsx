import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../component/context/AuthContext';
import dayjs from 'dayjs';
 import { useChallengeApi } from "../../api/challengeApi";
import { 
  Calendar, 
  Award, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Save, 
  ArrowLeft, 
  Edit3, 
  Loader 
} from 'lucide-react';

const UpdateChallenge = () => {
  const { token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const {fetchChallengeById,updateChallengeAPI}=useChallengeApi();

  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    points: '',
    bonusPoints: '',
    status: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const res = await fetchChallengeById(id);
        const challenge = res.data.challenge;

        setForm({
          title: challenge.title || '',
          description: challenge.description || '',
          dueDate: challenge.dueDate ? dayjs(challenge.dueDate).format('YYYY-MM-DD') : '',
          points: challenge.points || '',
          bonusPoints: challenge.bonusPoints || '',
          status: challenge.status || '',
        });
      } catch (err) {
        setError('Failed to load challenge data');
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    
    const formData = {
      ...form,
      points: parseInt(form.points),
      bonusPoints: parseInt(form.bonusPoints),
    };
    
    try {
    await updateChallengeAPI(id,formData);
      setSuccess('Challenge updated successfully!');
      setTimeout(() => navigate('/challenges'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update challenge');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'in-progress':
        return <Loader className="w-5 h-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader className="w-10 h-10 text-blue-600 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600 font-medium">Loading challenge data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg mt-10 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Edit3 className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Update Challenge</h2>
        </div>
        <button 
          onClick={() => navigate('/challenges')}
          className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-600">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-md flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
          <p className="text-green-600">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium text-gray-700 mb-2">Title</label>
          <input
            type="text"
            name="title"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter challenge title"
            required
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            rows="4"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the challenge details"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium text-gray-700 mb-2 md:flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              value={form.dueDate}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label className="block font-medium text-gray-700 mb-2 md:flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              Status
            </label>
            <div className="relative">
              <select
                name="status"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pr-10"
                value={form.status}
                onChange={handleChange}
                required
              >
                <option value="">Select Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                {form.status ? getStatusIcon(form.status) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium text-gray-700 mb-2 md:flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600" />
              Points
            </label>
            <input
              type="number"
              name="points"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              value={form.points}
              onChange={handleChange}
              min="1"
              max="100"
              placeholder="1-100"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-2 md:flex items-center gap-2">
              <Award className="w-4 h-4 text-yellow-500" />
              Bonus Points
            </label>
            <input
              type="number"
              name="bonusPoints"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              value={form.bonusPoints}
              onChange={handleChange}
              min="0"
              max="100"
              placeholder="0-100"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={submitting}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition ${
              submitting 
                ? 'bg-gray-400 cursor-not-allowed text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
            }`}
          >
            {submitting ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Update Challenge</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateChallenge;