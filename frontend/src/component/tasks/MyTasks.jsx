import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskList from './TaskList';
import { useAuth } from '../../component/context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
  PlusCircle, 
  Trash2, 
  RefreshCw, 
  CheckSquare, 
  Clock
} from 'lucide-react';

const MyTasks = () => {
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_URL;

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/task/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    await axios.put(`${baseUrl}/task/delete/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchTasks();
  };

  const handleToggleComplete = async (id, completed) => {
    await axios.patch(`${baseUrl}/task/complete/${id}`, { completed }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchTasks();
  };

  const handleEdit = (task) => {
    navigate(`/edittask/${task._id}`);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-xl md:text-3xl font-bold text-gray-800">My Tasks</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => fetchTasks()}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
          <Link
            to="/createtask"
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <PlusCircle size={16} />
            <span>Create Task</span>
          </Link>
          <Link
            to="/recycletask"
            className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <Trash2 size={16} />
            <span>Recycle Bin</span>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={20} className="text-amber-500" />
              <h2 className="text-xl font-bold text-gray-800">Pending Tasks</h2>
              <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {pendingTasks.length}
              </span>
            </div>
            <TaskList
              tasks={pendingTasks}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleComplete={handleToggleComplete}
              emptyMessage="No pending tasks. Great job!"
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <CheckSquare size={20} className="text-green-500" />
              <h2 className="text-xl font-bold text-gray-800">Completed Tasks</h2>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {completedTasks.length}
              </span>
            </div>
            <TaskList
              tasks={completedTasks}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleComplete={handleToggleComplete}
              emptyMessage="No completed tasks yet."
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTasks;