import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardList, 
  Trash2, 
  PlusCircle, 
  CheckSquare, 
  Calendar, 
  Tag, 
  Clock, 
  Edit3, 
  RefreshCw
} from 'lucide-react';

const Task = () => {
  const navigate = useNavigate();

  const features = [
    { icon: <PlusCircle className="w-5 h-5" />, text: "Create personal tasks with details like title, description, due date, priority, and tags" },
    { icon: <Calendar className="w-5 h-5" />, text: "Choose if the due date can be changed later when creating a task" },
    { icon: <Edit3 className="w-5 h-5" />, text: "Edit tasks at any time (if allowed), including updating details" },
    { icon: <CheckSquare className="w-5 h-5" />, text: "Mark tasks as complete or pending to track progress" },
    { icon: <Trash2 className="w-5 h-5" />, text: "Soft delete tasks temporarily or permanently delete when no longer needed" },
    { icon: <RefreshCw className="w-5 h-5" />, text: "Recover deleted tasks from the recycle bin" },
    { icon: <Clock className="w-5 h-5" />, text: "Track due dates with live countdown of remaining time" },
    { icon: <Tag className="w-5 h-5" />, text: "Use tags to categorize tasks for better organization" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Personal Task Manager</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay organized and productive with our simple yet powerful task management system
          </p>
        </div>
        
        {/* Main Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Create Task Card */}
          <div
            className="cursor-pointer bg-white text-purple-600 rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition duration-300 overflow-hidden group"
            onClick={() => navigate('/createtask')}
          >
            <div className="h-2 bg-purple-600 group-hover:bg-purple-700 transition-colors duration-300"></div>
            <div className="p-8 flex flex-col items-center">
              <div className="bg-purple-100 p-4 rounded-full mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                <PlusCircle className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold mb-2 group-hover:text-purple-600">Create Task</h3>
              <p className="text-gray-600 text-center">Add a new task with details, priority and due date</p>
            </div>
          </div>
          
          {/* My Tasks Card */}
          <div
            className="cursor-pointer bg-white text-blue-600 rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition duration-300 overflow-hidden group"
            onClick={() => navigate('/mytask')}
          >
            <div className="h-2 bg-blue-600 group-hover:bg-blue-700 transition-colors duration-300"></div>
            <div className="p-8 flex flex-col items-center">
              <div className="bg-blue-100 p-4 rounded-full mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <ClipboardList className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-600">My Tasks</h3>
              <p className="text-gray-600 text-center">View and manage your pending and completed tasks</p>
            </div>
          </div>
          
          {/* Recycle Task Card */}
          <div
            className="cursor-pointer bg-white text-green-600 rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition duration-300 overflow-hidden group"
            onClick={() => navigate('/recycletask')}
          >
            <div className="h-2 bg-green-600 group-hover:bg-green-700 transition-colors duration-300"></div>
            <div className="p-8 flex flex-col items-center">
              <div className="bg-green-100 p-4 rounded-full mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                <Trash2 className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold mb-2 group-hover:text-green-600">Recycle Bin</h3>
              <p className="text-gray-600 text-center">Recover or permanently delete your removed tasks</p>
            </div>
          </div>
        </div>
        
        {/* App Description Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">About This Task Manager</h2>
          <p className="text-lg text-gray-700 mb-8">
            This is a personal task management web app designed to help users stay organized and productive.
            With intuitive features and a clean interface, managing your daily tasks has never been easier.
          </p>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 p-2 bg-blue-50 rounded-lg text-blue-600">
                  {feature.icon}
                </div>
                <p className="ml-4 text-gray-600">{feature.text}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-10 pt-8 border-t border-gray-200">
            <p className="text-gray-700 italic">
              This app is built with simplicity, control, and productivity in mind, helping users manage their personal tasks effectively.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Task;