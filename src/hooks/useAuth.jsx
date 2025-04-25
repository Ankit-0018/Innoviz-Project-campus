import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load from localStorage on initial load
    const savedSession = localStorage.getItem("supabase_session");
    if (savedSession) {
      const session = JSON.parse(savedSession);
      setUser(session?.user || null);
    }

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        // Save to localStorage and state
        localStorage.setItem("supabase_session", JSON.stringify(session));
        setUser(session.user);
      } else {
        // Clear localStorage and state
        localStorage.removeItem("supabase_session");
        setUser(null);
      }
    });

    // Cleanup on unmount
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
