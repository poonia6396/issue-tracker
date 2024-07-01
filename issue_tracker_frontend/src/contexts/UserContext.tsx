import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from "react";
import { User } from "../interfaces/interfaces";
import { refreshAccessToken } from "../api/api"; // Assume this API fetches user details and refreshes access token

interface UserContextProps {
  user: User | null;
  setUser: (user: User | null) => void;
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("access_token"));
  const [lastActivityTime, setLastActivityTime] = useState<Date>(new Date());

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }, []);

  useEffect(() => {
    const refreshToken = async () => {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          const { access } = await refreshAccessToken(refreshToken);
          setToken(access);
        } catch (error) {
          console.error("Failed to refresh access token", error);
          logout();
        }
      } else {
        logout();
      }
    };

    const interval = setInterval(refreshToken, 14 * 60 * 1000); // Refresh token every 14 minutes
    return () => clearInterval(interval);
  }, [logout]);

  useEffect(() => {
    const handleActivity = () => setLastActivityTime(new Date());

    window.addEventListener("click", handleActivity);
    window.addEventListener("keydown", handleActivity);

    const checkInactivity = () => {
      if (new Date().getTime() - lastActivityTime.getTime() > 15 * 60 * 1000) {
        logout();
      }
    };

    const interval = setInterval(checkInactivity, 60 * 1000); // Check inactivity every minute
    return () => {
      clearInterval(interval);
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("keydown", handleActivity);
    };
  }, [lastActivityTime, logout]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("access_token", token);
    } else {
      localStorage.removeItem("access_token");
    }
  }, [token]);

  return (
    <UserContext.Provider value={{ user, setUser, token, setToken, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextProps => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
