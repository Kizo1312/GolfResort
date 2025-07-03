import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type User = {
  id: number;
  name: string;
  last_name: string;
  email: string;
  role: "admin" | "user";
};

type AuthData = {
  user: User | null;
  accessToken: string | null;
  login: (d: { user: User; access_token: string }) => void;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthData | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load sessionStorage once
  useEffect(() => {
    const storedUser = sessionStorage.getItem("authUser");
    const storedToken = sessionStorage.getItem("authToken");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setAccessToken(storedToken);
    }
    setIsLoading(false);
  }, []);

  // Set after login
  const login = (d: { user: User; access_token: string }) => {
    setUser(d.user);
    setAccessToken(d.access_token);
    sessionStorage.setItem("authUser", JSON.stringify(d.user));
    sessionStorage.setItem("authToken", d.access_token);
  };

  // Clear on logout
  const logout = () => {
    setUser(null);
    setAccessToken(null);
    sessionStorage.removeItem("authUser");
    sessionStorage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
};
