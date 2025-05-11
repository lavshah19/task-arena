import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../component/context/AuthContext';
import { Link } from 'react-router-dom';
import { Trash2, RefreshCw, Plus, Archive, AlertCircle, AlertTriangle } from 'lucide-react';
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Set app element for accessibility (usually your root element)
Modal.setAppElement('#root');

const RecycleTasks = () => {
  const { token } = useAuth();
  const [deletedTasks, setDeletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState({ id: null, title: '' });
  const baseUrl = import.meta.env.VITE_API_URL;

  const fetchDeletedTasks = async () => {
    try {
      const res = await axios.get(`${baseUrl}/task/get-deleted`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setDeletedTasks(res.data.tasks);
      } else {
        setError('Failed to fetch deleted tasks');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching deleted tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (taskId) => {
    try {
      await axios.patch(`${baseUrl}/task/restore/${taskId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeletedTasks((prev) => prev.filter((task) => task._id !== taskId));
      toast.success('Task restored successfully');
    } catch (err) {
      toast.error('Failed to restore task');
    }
  };

  const openDeleteModal = (taskId, taskTitle) => {
    setTaskToDelete({ id: taskId, title: taskTitle });
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handlePermanentDelete = async () => {
    try {
      await axios.delete(`${baseUrl}/task/delete/permanent/${taskToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeletedTasks((prev) => prev.filter((task) => task._id !== taskToDelete.id));
      closeModal();
      toast.success('Task permanently deleted');
    } catch (err) {
      toast.error('Failed to permanently delete task');
    }
  };

  useEffect(() => {
    fetchDeletedTasks();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Modal custom styles
  const customModalStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      borderRadius: '0.5rem',
      padding: '1.5rem',
      maxWidth: '500px',
      width: '90%'
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.4)'
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg">
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customModalStyles}
        contentLabel="Delete Confirmation"
      >
        <div className="flex items-center mb-4 text-red-500">
          <AlertTriangle size={24} className="mr-2" />
          <h3 className="text-xl font-bold">Confirm Permanent Deletion</h3>
        </div>
        <p className="mb-2 text-gray-700">Are you sure you want to permanently delete this task?</p>
        <p className="mb-6 font-medium text-gray-900">"{taskToDelete.title}"</p>
        <p className="text-sm text-red-600 mb-6">This action cannot be undone.</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handlePermanentDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
          >
            <Trash2 size={16} className="mr-2" />
            Delete Permanently
          </button>
        </div>
      </Modal>

      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <div className="flex items-center space-x-3">
          <Archive className="text-gray-700" size={24} />
          <h2 className="text-2xl font-bold text-gray-800">Recycle Bin</h2>
        </div>
        <div className="flex space-x-3">
          <Link 
            to="/createtask" 
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus size={18} className="mr-2" />
            Create Task
          </Link>
          <Link 
            to="/mytask" 
            className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
          >
            <Archive size={18} className="mr-2" />
            My Tasks
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-center">
            <AlertCircle className="text-red-500 mr-3" size={20} />
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      )}

      {deletedTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-xl">
          <Trash2 size={48} className="text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">No deleted tasks found.</p>
          <p className="text-gray-400 text-sm mt-2">Tasks you delete will appear here</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {deletedTasks.map((task) => (
            <li
              key={task._id}
              className="p-5 border border-gray-200 hover:border-gray-300 rounded-lg flex justify-between items-start bg-white hover:bg-gray-50 transition-colors shadow-sm"
            >
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                <p className="text-gray-600 mt-1">{task.description}</p>
                {task.deletedAt && (
                  <div className="flex items-center mt-3 text-xs text-red-500">
                    <Trash2 size={14} className="mr-1" />
                    <span>Deleted: {new Date(task.deletedAt).toLocaleString()}</span>
                  </div>
                )}
              </div>
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => handleRestore(task._id)}
                  className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                  title="Restore task"
                >
                  <RefreshCw size={16} className="mr-2" />
                  Restore
                </button>
                <button
                  onClick={() => openDeleteModal(task._id, task.title)}
                  className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                  title="Delete permanently"
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecycleTasks;