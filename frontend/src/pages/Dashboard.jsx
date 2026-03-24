import React, { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api";
import TaskCard from "../components/TaskCard";
import AddTaskModal from "../components/AddTaskModal";
import EditTaskModal from "../components/EditTaskModal";
import ShareTaskModal from "../components/ShareTaskModal";
import ThemeToggle from "../components/ThemeToggle";
import NotificationDropdown from "../components/NotificationDropdown";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [sharingTask, setSharingTask] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);
  
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");

  const fetchTasks = useCallback(async () => {
    try {
      const { data } = await api.get("/tasks");
      setTasks(data);
    } catch (err) {
      setError("Failed to load tasks. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      const { data } = await api.get("/notifications");
      setNotifications(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => { 
    fetchTasks(); 
    fetchNotifications(); 
  }, [fetchTasks, fetchNotifications]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAdd = async (formData) => {
    const { data } = await api.post("/tasks", formData);
    setTasks((prev) => [data, ...prev]);
  };

  const handleUpdate = async (id, formData) => {
    const { data } = await api.put(`/tasks/${id}`, formData);
    setTasks((prev) => prev.map((t) => (t._id === id ? data : t)));
  };

  const handleDelete = async (id) => {
    await api.delete(`/tasks/${id}`);
    setTasks((prev) => prev.filter((t) => t._id !== id));
  };

  const handleReadNotif = async (id) => {
    await api.put(`/notifications/${id}/read`);
    setNotifications((prev) => prev.map(n => n._id === id ? { ...n, read: true } : n));
  };

  const handleReadAllNotif = async () => {
    await api.put(`/notifications/read-all`);
    setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const pending = total - completed;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  const visibleTasks = tasks
    .filter((t) => {
      if (filter === "pending" && t.status !== "pending") return false;
      if (filter === "completed" && t.status !== "completed") return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const inTitle = t.title.toLowerCase().includes(q);
        const inDesc = t.description?.toLowerCase().includes(q);
        if (!inTitle && !inDesc) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "date") return new Date(a.date) - new Date(b.date);
      if (sortBy === "priority") {
        const pMap = { high: 3, medium: 2, low: 1 };
        const pa = pMap[a.priority] || 2;
        const pb = pMap[b.priority] || 2;
        if (pa !== pb) return pb - pa;
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  return (
    <div className="min-h-screen bg-white transition-colors dark:bg-zinc-950 flex flex-col font-sans">
      <header className="sticky top-0 z-40 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-white/10 px-4 sm:px-6 py-4 transition-colors">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500 rounded-lg p-1.5 shadow-lg shadow-indigo-500/20">
              <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
                <path d="M8 14l4 4 8-8" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white hidden sm:block">TaskFlow</span>
          </div>

          <div className="flex-1 max-w-md relative group hidden md:block">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <input 
              type="text" 
              placeholder="Search tasks..." 
              className="w-full bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none transition-all focus:border-indigo-500/50 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-sm font-medium">
            
            {/* Notifications Bell */}
            <div className="relative" ref={notifRef}>
              <button 
                className="relative w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm"
                onClick={() => setShowNotifications(!showNotifications)}
                aria-label="Notifications"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                )}
              </button>

              {showNotifications && (
                <NotificationDropdown 
                  notifications={notifications} 
                  onClose={() => setShowNotifications(false)} 
                  onRead={handleReadNotif}
                  onReadAll={handleReadAllNotif}
                />
              )}
            </div>

            <ThemeToggle className="hidden sm:flex" />

            <div className="w-px h-4 bg-zinc-200 dark:bg-white/10 hidden sm:block"></div>
            
            <button className="text-zinc-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors ml-1" onClick={handleLogout}>
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8 md:gap-10">
        
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 animate-fade-in">
          <div className="glass-card p-5 md:p-6 flex flex-col gap-2 relative overflow-hidden group border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900/60 shadow-sm dark:shadow-xl transition-colors">
            <span className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white tracking-tight">{total}</span>
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Total</span>
          </div>
          <div className="glass-card p-5 md:p-6 flex flex-col gap-2 relative overflow-hidden group border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900/60 shadow-sm dark:shadow-xl transition-colors">
            <span className="text-3xl md:text-4xl font-bold text-indigo-600 dark:text-indigo-400 tracking-tight">{pending}</span>
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Pending</span>
          </div>
          <div className="glass-card p-5 md:p-6 flex flex-col gap-2 relative overflow-hidden group border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900/60 shadow-sm dark:shadow-xl transition-colors">
            <span className="text-3xl md:text-4xl font-bold text-emerald-500 dark:text-emerald-400 tracking-tight">{completed}</span>
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Completed</span>
          </div>
          <div className="glass-card p-5 md:p-6 flex flex-col justify-between gap-4 border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900/60 shadow-sm dark:shadow-xl transition-colors">
            <div className="flex items-end justify-between">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Progress</span>
              <span className="text-2xl font-bold text-zinc-900 dark:text-white">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800/50 rounded-full overflow-hidden border border-zinc-200 dark:border-white/5">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full transition-all duration-1000 ease-out" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </section>

        {/* Mobile Search Bar */}
        <div className="md:hidden relative group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <input 
            type="text" 
            placeholder="Search tasks..." 
            className="w-full bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none focus:border-indigo-500/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <section className="flex flex-col gap-6 animate-fade-in" style={{ animationDelay: "100ms", animationFillMode: "both" }}>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 rounded-xl flex-shrink-0">
                {["all", "pending", "completed"].map((f) => (
                  <button
                    key={f}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
                      filter === f 
                        ? "bg-white text-zinc-900 dark:bg-zinc-800 dark:text-white shadow-sm" 
                        : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-800/50"
                    }`}
                    onClick={() => setFilter(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div className="flex-shrink-0">
                <select 
                  className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 text-sm rounded-xl px-3 py-2 text-zinc-600 dark:text-zinc-400 outline-none cursor-pointer focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="default">Sort by: Default</option>
                  <option value="date">Sort by: Due Date</option>
                  <option value="priority">Sort by: Priority</option>
                </select>
              </div>
            </div>

            <button className="btn-primary flex items-center justify-center gap-2 flex-shrink-0" onClick={() => setShowAddModal(true)}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M7 2v10M2 7h10" />
              </svg>
              New Task
            </button>
          </div>

          {error && (
             <div className="p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex gap-3 text-sm animate-slide-down">
               <span className="text-red-500 dark:text-red-400">⚠</span>
               <span className="text-red-800 dark:text-red-200">{error}</span>
             </div>
          )}

          {loading && (
             <div className="flex flex-col gap-3">
               {[1, 2, 3].map((i) => (
                 <div key={i} className="h-[120px] rounded-2xl bg-zinc-100 dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/5 animate-pulse" />
               ))}
             </div>
          )}

          {!loading && visibleTasks.length === 0 && (
            <div className="flex flex-col items-center justify-center p-12 lg:p-24 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800/50 rounded-3xl bg-zinc-50 dark:bg-zinc-900/20">
              <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center mb-4 text-2xl text-zinc-400 dark:text-zinc-500">
                {search ? "🔍" : filter === "completed" ? "✓" : filter === "pending" ? "◎" : "◈"}
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                {search ? "No matches found" : filter === "all" ? "No tasks yet" : `No ${filter} tasks`}
              </h3>
              <p className="text-zinc-500 max-w-sm mb-6">
                {search ? `Try adjusting your search criteria.` : filter === "all" ? "Get started by creating a new task to track your progress and stay organized." : `Switch your filter to 'All' to see everything on your agenda.`}
              </p>
              {!search && filter === "all" && (
                <button className="btn-primary" onClick={() => setShowAddModal(true)}>Add first task</button>
              )}
            </div>
          )}

          {!loading && visibleTasks.length > 0 && (
            <div className="flex flex-col gap-3 md:gap-4">
              {visibleTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onUpdate={handleUpdate}
                  onEdit={setEditingTask}
                  onShare={setSharingTask}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {showAddModal && <AddTaskModal onClose={() => setShowAddModal(false)} onAdd={handleAdd} />}
      {editingTask && <EditTaskModal task={editingTask} onClose={() => setEditingTask(null)} onUpdate={handleUpdate} />}
      {sharingTask && <ShareTaskModal task={sharingTask} onClose={() => setSharingTask(null)} />}
    </div>
  );
};

export default Dashboard;
