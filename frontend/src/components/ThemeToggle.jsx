import React from "react";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();
  
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className={`relative w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
        isDark 
          ? "bg-zinc-900 border border-zinc-800 text-yellow-400 hover:bg-zinc-800 hover:text-yellow-300" 
          : "bg-white border border-gray-200 text-indigo-500 hover:bg-gray-50 hover:text-indigo-600 shadow-sm"
      } ${className}`}
      aria-label="Toggle Theme"
    >
      <div className="relative w-5 h-5 overflow-hidden">
        <svg
          className={`absolute inset-0 transition-transform duration-500 origin-center ${
            isDark ? "rotate-0 opacity-100 scale-100" : "-rotate-90 opacity-0 scale-50"
          }`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>

        <svg
          className={`absolute inset-0 transition-transform duration-500 origin-center ${
            isDark ? "rotate-90 opacity-0 scale-50" : "rotate-0 opacity-100 scale-100"
          }`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </div>
    </button>
  );
};

export default ThemeToggle;
