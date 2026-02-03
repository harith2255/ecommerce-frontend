import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { registerUser, loginUser } from "../services/authServices";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading:boolean;
  login: (email: string, password: string) => Promise<User | null>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState< User| null>(null);

  const [token, setToken] = useState<string | null>(null);
  const [loading,setLoading]=useState(true);

  // restore auth or app reload
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);
  

  /* 🔁 Persist auth state */
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");

    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [token, user]);

  /* ✅ REGISTER */
  const register = async (
    email: string,
    password: string,
    name: string
  ) => {
    try {
      const data = await registerUser(name, email, password);
      setUser(data.user);
      setToken(data.token);
      return true;
    } catch (error) {
      console.error("Register failed", error);
      return false;
    }
  };

  /* ✅ LOGIN */
  const login = async (email: string, password: string) => {
    try {
      const data = await loginUser(email, password);
      setUser(data.user);
      setToken(data.token);
      return data.user;
    } catch (error) {
      console.error("Login failed", error);
      return null;
    }
  };

  /* ✅ LOGOUT */
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token,loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
