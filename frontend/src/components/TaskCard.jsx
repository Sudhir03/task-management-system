import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const TaskCard = ({ task, onUpdate, onEdit, onDelete, onShare }) => {
  const { user } = useAuth();
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);

  // fallback for user ID
  const isOwner = task.userId === (user?._id || user?.id);
  const isCompleted = task.status === "completed";

  const dueDate = new Date(task.date).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

  const isOverdue = !isCompleted && new Date(task.date) < new Date().setHours(0, 0, 0, 0);

  const handleToggle = async () => {
    setToggling(true);
    try { await onUpdate(task._id, { status: isCompleted ? "pending" : "completed" }); } 
    finally { setToggling(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this task?")) return;
    setDeleting(true);
    try { await onDelete(task._id); } 
    finally { setDeleting(false); }
  };

  const priorityColors = {
    low: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    high: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <div className={`p-5 rounded-2xl flex gap-4 transition-all duration-300 border ${
      isCompleted 
        ? "dark:bg-zinc-900/40 dark:border-zinc-800/50 bg-gray-50 border-gray-200 opacity-60 hover:opacity-100" 
        : "glass hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/5"
    }`}>
      
      <button
        className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
          isCompleted 
            ? "bg-indigo-500 border-indigo-500 text-white" 
            : "border-zinc-300 dark:border-zinc-600 hover:border-indigo-400 text-transparent"
        }`}
        onClick={handleToggle}
        disabled={toggling}
        aria-label={isCompleted ? "Mark as pending" : "Mark as completed"}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={isCompleted ? "opacity-100" : "opacity-0"}>
          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="flex-1 min-w-0">
        <h3 className={`text-base font-semibold truncate mb-1 transition-colors ${
          isCompleted ? "line-through text-zinc-500 dark:text-zinc-500" : "text-zinc-900 dark:text-zinc-100"
        }`}>
          {task.title}
        </h3>
        
        {task.description && (
          <p className={`text-sm mb-3 line-clamp-2 ${isCompleted ? "text-zinc-400 dark:text-zinc-600" : "text-zinc-500 dark:text-zinc-400"}`}>
            {task.description}
          </p>
        )}
        
        <div className="flex flex-wrap items-center gap-3">
          <span className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md border ${
            isOverdue 
              ? "bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20" 
              : "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800/50 dark:text-zinc-400 dark:border-zinc-700/50"
          }`}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="1" y="2" width="10" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
              <path d="M4 1v2M8 1v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M1 5h10" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            {isOverdue ? `Overdue · ${dueDate}` : dueDate}
          </span>

          {!isCompleted && task.priority && (
            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md border ${priorityColors[task.priority] || priorityColors.medium}`}>
              {task.priority}
            </span>
          )}

          {!isOwner && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md bg-indigo-50 border-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20">
              Shared with you
            </span>
          )}

          {isOwner && task.sharedWith?.length > 0 && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md bg-zinc-100 text-zinc-600 border border-zinc-200 dark:bg-zinc-800/80 dark:text-zinc-400 dark:border-zinc-700/50 flex items-center gap-1">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              Shared ({task.sharedWith.length})
            </span>
          )}

          <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md ${
            isCompleted 
              ? "bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-500" 
              : "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
          }`}>
            {isCompleted ? "Completed" : "Pending"}
          </span>
        </div>
      </div>

      <div className="flex items-start gap-1">
        {isOwner && (
          <button
            className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-emerald-500 hover:bg-emerald-50 dark:text-zinc-500 dark:hover:text-emerald-400 dark:hover:bg-emerald-500/10 transition-colors"
            onClick={() => onShare(task)}
            aria-label="Share task"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
              <polyline points="16 6 12 2 8 6"></polyline>
              <line x1="12" y1="2" x2="12" y2="15"></line>
            </svg>
          </button>
        )}

        <button
          className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-indigo-500 hover:bg-indigo-50 dark:text-zinc-500 dark:hover:text-indigo-400 dark:hover:bg-indigo-500/10 transition-colors"
          onClick={() => onEdit(task)}
          aria-label="Edit task"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>

        {isOwner && (
          <button
            className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:text-zinc-500 dark:hover:text-red-400 dark:hover:bg-red-500/10 transition-colors"
            onClick={handleDelete}
            disabled={deleting}
            aria-label="Delete task"
          >
            {deleting ? (
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
                <path d="M2 3.5h10M5.5 3.5V2.5a1 1 0 012 0v1M6 6v4M8 6v4M3 3.5l.6 7a1 1 0 001 .9h4.8a1 1 0 001-.9l.6-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
