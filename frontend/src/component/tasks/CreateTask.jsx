import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../component/context/AuthContext';
import { FilePlus, Trash2, AlertCircle, Calendar, ChevronDown, Check, Plus, Loader2 } from 'lucide-react';

const CreateTask = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    tags: '',
    isDueDateChangeable: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const baseUrl = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${baseUrl}/task/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        navigate('/mytask');
      } else {
        setError(response.data.message || 'Failed to create task');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating task');
    } finally {
      setLoading(false);
    }
  };

  // Priority color mapping
  const priorityColors = {
    low: 'bg-green-100 text-green-800 border-green-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    high: 'bg-red-100 text-red-800 border-red-300',
  };

  return (
    <div className="max-w-3xl mx-auto p-8 mt-10 bg-white rounded-xl shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-700">Create New Task</h1>
          <p className="text-gray-500 mt-1">Add a new task to your workflow</p>
        </div>
        <div className="flex space-x-3">
          <Link
            to="/mytask"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center shadow-md"
          >
            <FilePlus className="w-5 h-5 mr-2" />
            My Tasks
          </Link>
          <Link
            to="/recycletask"
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300 flex items-center shadow-md"
          >
            <Trash2 className="w-5 h-5 mr-2" />
            Recycle Bin
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
          <div className="flex">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="Enter task title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                required
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Describe your task here..."
              rows="4"
            />
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <div className="relative px-1.5">
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className={`block w-full border rounded-lg p-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${priorityColors[formData.priority]}`}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  {/* <ChevronDown className="w-5 h-5 text-gray-400" /> */}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="work, personal, urgent..."
              />
              <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isDueDateChangeable"
                name="isDueDateChangeable"
                checked={formData.isDueDateChangeable}
                onChange={handleChange}
                className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="isDueDateChangeable" className="ml-2 text-sm text-gray-700">
                Allow changing the due date later
              </label>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300 flex items-center justify-center font-medium text-lg shadow-md"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              Creating...
            </>
          ) : (
            <>
              <Plus className="w-5 h-5 mr-2" />
              Create Task
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateTask;