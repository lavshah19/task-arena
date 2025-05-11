import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../component/context/AuthContext';
import dayjs from 'dayjs';
import { Calendar, ChevronDown, AlertCircle, Save, ArrowLeft, Loader2 } from 'lucide-react';

const EditTask = () => {
  const { token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  // State for the fetched task data (for loading/display) and form fields.
  const [taskData, setTaskData] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    tags: '',  // Initialize tags as an empty string
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const baseUrl = import.meta.env.VITE_API_URL;

  // Fetch the current task data using GET /api/task/get/:id
  useEffect(() => {
    const fetchTaskData = async () => {
      try {
      const res = await axios.get(`${baseUrl}/task/get/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          const task = res.data.task;
          setTaskData(task);
          // Initialize formData with task data.
          setFormData({
            title: task.title || '',
            description: task.description || '',
            dueDate: task.dueDate ? dayjs(task.dueDate).format('YYYY-MM-DD') : '',
            priority: task.priority || 'medium',
            tags: task.tags.join(' ') || '', // convert to string again which was in array in the backend
          });
        } else {
          setError('Task not found.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching task data');
      } finally {
        setLoading(false);
      }
    };
    fetchTaskData();
  }, [id, token]);

  // Handle form field changes.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // On form submit, send updated data with PUT /api/task/update/:id.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    // Convert tags from comma-separated string to an array
    const updatedTags = formData.tags.split(' ').map((tag) => tag.trim()).filter((tag) => tag.length > 0);

    const updatedFormData = { ...formData, tags: updatedTags }; // Include the formatted tags in the form data

    try {
      const res = await axios.put(`${baseUrl}/task/update/${id}`, updatedFormData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        navigate('/mytask'); // Redirect back to your mytask list page after a successful update.
      } else {
        setError(res.data.message || 'Update failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating task');
    } finally {
      setSubmitting(false);
    }
  };

  // Priority color mapping
  const priorityColors = {
    low: 'bg-green-100 text-green-800 border-green-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    high: 'bg-red-100 text-red-800 border-red-300',
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-lg text-gray-600">Loading task details...</p>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto p-8 mt-10 bg-white rounded-xl shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-700">Edit Task</h1>
          <p className="text-gray-500 mt-1">Make changes to your task</p>
        </div>
        <Link
          to="/mytask"
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300 flex items-center shadow-sm"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Tasks
        </Link>
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
              <div className="relative">
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="block w-full border border-gray-300 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Calendar className="w-5 h-5 text-gray-400" />
                </div>
              </div>
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
              <div className="relative">
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
                placeholder="work personal urgent"
              />
              <p className="text-xs text-gray-500 mt-1">Separate tags with spaces</p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate('/mytask')}
            className="w-1/3 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-300 transition duration-300 font-medium shadow-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-2/3 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300 flex items-center justify-center font-medium text-lg shadow-md"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                Updating...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTask;