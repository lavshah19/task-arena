import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Edit, 
  Trash2, 
  Tag, 
  AlertTriangle, 
  ArrowUpCircle,
  ArrowDownCircle,
  MinusCircle
} from 'lucide-react';

dayjs.extend(relativeTime);

const TaskCard = ({ task, onEdit, onDelete, onToggleComplete }) => {
  const dueDateFormatted = task.dueDate
    ? dayjs(task.dueDate).format('YYYY/MM/DD')
    : 'N/A';

  const timeRemaining = task.dueDate
    ? dayjs(task.dueDate).fromNow()
    : null;
  
  const isOverdue = task.dueDate && !task.completed && dayjs().isAfter(dayjs(task.dueDate));

  // Priority icons and colors
  const priorityConfig = {
    high: { 
      icon: <ArrowUpCircle size={16} className="text-red-500" />,
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-200'
    },
    medium: { 
      icon: <MinusCircle size={16} className="text-amber-500" />,
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
      borderColor: 'border-amber-200'
    },
    low: { 
      icon: <ArrowDownCircle size={16} className="text-green-500" />,
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200'
    }
  };

  const priorityInfo = priorityConfig[task.priority?.toLowerCase()] || priorityConfig.medium;

  return (
    <div className={`${priorityInfo.bgColor} border ${priorityInfo.borderColor} rounded-lg p-4 mb-4 ${task.completed ? 'opacity-80' : ''}`}>
      <div className="flex justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {task.completed ? (
              <CheckCircle2 size={18} className="text-green-600" />
            ) : (
              priorityInfo.icon
            )}
            <h3 className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
              {task.title}
            </h3>
          </div>
          
          <p className="text-sm text-gray-600 mb-3">{task.description || 'No description'}</p>
          
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-1">
              <Calendar size={14} className="text-gray-500" />
              <span>Due: {dueDateFormatted}</span>
            </div>
            
            {timeRemaining && (
              <div className={`flex items-center gap-1 ${isOverdue && !task.completed ? 'text-red-600 font-medium' : 'text-blue-600'}`}>
                <Clock size={14} />
                <span>{isOverdue && !task.completed ? 'Overdue ' : ''}{timeRemaining}</span>
              </div>
            )}
            
            {!task.isDueDateChangeable && (
              <div className="flex items-center gap-1 text-red-600">
                <AlertTriangle size={14} />
                <span>Due date locked</span>
              </div>
            )}
          </div>

          {/* Display tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2 items-center">
              <Tag size={14} className="text-gray-500" />
              {task.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 ml-3">
          <button
            onClick={() => onToggleComplete(task._id, !task.completed)}
            className={`flex items-center justify-center gap-1 text-xs px-3 py-1.5 rounded-md transition-colors ${
              task.completed 
                ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' 
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            <CheckCircle2 size={14} />
            {task.completed ? 'Undo' : 'Complete'}
          </button>
          
          <button 
            onClick={() => onEdit(task)} 
            className="flex items-center justify-center gap-1 text-xs px-3 py-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md transition-colors"
          >
            <Edit size={14} />
            Edit
          </button>
          
          <button 
            onClick={() => onDelete(task._id)} 
            className="flex items-center justify-center gap-1 text-xs px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-md transition-colors"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;