"use client";

import { User } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext<IAppContext | undefined>(undefined);

interface IAppContext {
  user: User | undefined;
}

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCurrentUser = () => {
      try {
        setLoading(true);

        // supabase fetch current user
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentUser();
  });
  if (loading) return <div>Loading...</div>;

  return <AppContext.Provider value={{ user }}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}
