// ─────────────────────────────────────────────
//  src/context/AuthContext.js
//  Global authentication state using React Context
// ─────────────────────────────────────────────
import React, { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);

/**
 * AuthProvider — wraps the entire app and provides:
 *   - user       : the logged-in user object (or null)
 *   - login()    : store token + user in state and localStorage
 *   - logout()   : clear everything
 *   - isLoggedIn : boolean convenience flag
 */
export const AuthProvider = ({ children }) => {
  // Initialise from localStorage so the session survives page refresh
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback((userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook — cleaner than useContext(AuthContext) everywhere
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
