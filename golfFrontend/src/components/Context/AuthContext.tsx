import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type User = {
  id: number;
  name: string;
  last_name: string;
  email: string;
  role: "admin" | "user";
};

type AuthData = {
  user:      User | null;
  accessToken: string | null;
  login:     (d: { user: User; access_token: string }) => void;
  logout:    () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthData | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user,        setUser]        = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading,   setIsLoading]   = useState(true);

  /* 🔄  učitaj localStorage samo JEDNOM */
  useEffect(() => {
    const storedUser  = localStorage.getItem("authUser");
    const storedToken = localStorage.getItem("authToken");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setAccessToken(storedToken);
    }
    setIsLoading(false);
  }, []);

  /* 🔐  postavi nakon uspješnog logina */
  const login = (d: { user: User; access_token: string }) => {
    setUser(d.user);
    setAccessToken(d.access_token);
    localStorage.setItem("authUser",  JSON.stringify(d.user));
    localStorage.setItem("authToken", d.access_token);
  };

  /* 🚪  logout */
  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("authUser");
    localStorage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth mora biti korišten unutar <AuthProvider>");
  return ctx;
};
