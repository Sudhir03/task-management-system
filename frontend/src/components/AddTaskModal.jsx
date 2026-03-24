import React, { useState, useEffect } from "react";

const EMPTY = { title: "", description: "", date: "", priority: "medium" };

const AddTaskModal = ({ onClose, onAdd }) => {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim()) return setError("Task title is required");
    if (!form.date) return setError("Due date is required");

    setLoading(true);
    try {
      await onAdd(form);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm" />
      
      <div 
        className="glass-card w-full max-w-[500px] relative z-10 flex flex-col p-6 sm:p-8 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white tracking-tight">New Task</h2>
          <button 
            className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors" 
            onClick={onClose} 
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M1 1l12 12M1 13L13 1" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 flex gap-3 animate-slide-down text-sm">
            <span className="text-red-400">⚠</span>
            <span className="text-red-200">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4.5">
          <div className="mb-4">
            <label className="form-label" htmlFor="task-title">Title <span className="text-indigo-400">*</span></label>
            <input id="task-title" className="form-input" type="text" name="title" placeholder="What needs to be done?" value={form.title} onChange={handleChange} required autoFocus maxLength={100} />
          </div>

          <div className="mb-4">
            <label className="form-label" htmlFor="task-desc">Description</label>
            <textarea id="task-desc" className="form-input min-h-[100px] resize-y" name="description" placeholder="Add details (optional)" value={form.description} onChange={handleChange} maxLength={500} />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="form-label" htmlFor="task-date">Due Date <span className="text-indigo-400">*</span></label>
              <input id="task-date" className="form-input [color-scheme:dark]" type="date" name="date" value={form.date} onChange={handleChange} required min={new Date().toISOString().split("T")[0]} />
            </div>
            
            <div>
              <label className="form-label" htmlFor="task-priority">Priority</label>
              <select id="task-priority" name="priority" className="form-input appearance-none bg-zinc-900/50" value={form.priority} onChange={handleChange}>
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5 mt-auto">
            <button type="button" className="btn-ghost" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary flex items-center gap-2" disabled={loading}>
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                  Adding…
                </>
              ) : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
