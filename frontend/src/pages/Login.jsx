import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "../components/ThemeToggle";
import api from "../api";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/login", form);
      login(data.user, data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-white dark:bg-zinc-950 transition-colors duration-300">
      <ThemeToggle className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50" />
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none transition-colors" />
      
      <div className="w-full max-w-[400px] relative z-10 flex flex-col items-center animate-fade-in">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-indigo-500 rounded-xl p-1.5 shadow-lg shadow-indigo-500/30">
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
              <path d="M8 14l4 4 8-8" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white transition-colors">TaskFlow</span>
        </div>

        <div className="glass-card w-full p-8 md:p-10 border border-zinc-200 dark:border-white/10 bg-white/70 dark:bg-zinc-900/60 shadow-xl transition-colors">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2 transition-colors">Welcome back</h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm transition-colors">Sign in to your workspace</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-start gap-3 animate-slide-down transition-colors">
              <span className="text-red-500 dark:text-red-400 mt-0.5">⚠</span>
              <span className="text-red-700 dark:text-red-200 text-sm leading-relaxed">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="form-label text-zinc-700 dark:text-zinc-300 transition-colors" htmlFor="email">Email</label>
              <input 
                id="email" 
                className="form-input bg-zinc-50 border-zinc-200 text-zinc-900 focus:bg-white dark:bg-zinc-800/50 dark:border-zinc-700 dark:text-zinc-100 dark:focus:bg-zinc-800 transition-colors" 
                type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required autoComplete="email" 
              />
            </div>

            <div>
              <label className="form-label text-zinc-700 dark:text-zinc-300 transition-colors" htmlFor="password">Password</label>
              <input 
                id="password" 
                className="form-input bg-zinc-50 border-zinc-200 text-zinc-900 focus:bg-white dark:bg-zinc-800/50 dark:border-zinc-700 dark:text-zinc-100 dark:focus:bg-zinc-800 transition-colors" 
                type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} required autoComplete="current-password" 
              />
            </div>

            <button type="submit" className="btn-primary w-full mt-2 flex justify-center items-center gap-2" disabled={loading}>
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                  Signing in…
                </>
              ) : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400 transition-colors">
            Don't have an account? <Link to="/register" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors font-medium">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
