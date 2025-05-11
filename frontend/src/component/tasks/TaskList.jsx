import React from 'react';
import TaskCard from './TaskCard';
import { ClipboardList } from 'lucide-react';

const TaskList = ({ tasks, onEdit, onDelete, onToggleComplete, emptyMessage = "No tasks here." }) => {
  return (
    <div className="task-list">
      {tasks.length > 0 ? (
        <div className="space-y-3">
          {tasks.map(task => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleComplete={onToggleComplete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <ClipboardList size={40} className="mx-auto text-gray-400 mb-2" />
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
};

export default TaskList;