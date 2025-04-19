// lib/auth.js
import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export const useUser = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const user = supabase.auth.user();
    setUser(user);

    // Listen for changes in user session
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  return { user };
};
