import React, { useState, useEffect } from "react";
import api from "../api";

const ShareTaskModal = ({ task, onClose }) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });
    
    if (!email.trim()) {
      return setStatus({ type: "error", message: "Email is required" });
    }

    setLoading(true);
    try {
      await api.post(`/tasks/${task._id}/share`, { email });
      setStatus({ type: "success", message: "Task shared successfully!" });
      setEmail("");
      // Automatically close after a delay on success
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      setStatus({ 
        type: "error", 
        message: err.response?.data?.message || "Failed to share task" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm" />
      
      <div 
        className="glass-card w-full max-w-[400px] relative z-10 flex flex-col p-6 sm:p-8 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white tracking-tight">Share Task</h2>
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

        <div className="mb-6">
          <p className="text-sm text-zinc-400">
            Invite a colleague to collaborate on <strong className="text-zinc-200">"{task.title}"</strong>. They will be able to view and edit the task.
          </p>
        </div>

        {status.message && (
          <div className={`mb-5 p-3.5 rounded-xl border flex gap-3 animate-slide-down text-sm ${
            status.type === "error" 
              ? "bg-red-500/10 border-red-500/20 text-red-200" 
              : "bg-emerald-500/10 border-emerald-500/20 text-emerald-200"
          }`}>
            <span className={status.type === "error" ? "text-red-400" : "text-emerald-400"}>
              {status.type === "error" ? "⚠" : "✓"}
            </span>
            <span>{status.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="form-label" htmlFor="share-email">Collaborator's Email</label>
            <input 
              id="share-email" 
              className="form-input" 
              type="email" 
              name="email" 
              placeholder="colleague@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              autoFocus 
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5 mt-2">
            <button type="button" className="btn-ghost" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary flex items-center gap-2" disabled={loading}>
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Sending…
                </>
              ) : "Share Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShareTaskModal;
