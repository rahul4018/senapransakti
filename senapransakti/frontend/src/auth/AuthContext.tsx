import { createContext, useContext, useState, ReactNode } from "react";

type Role = "ADMIN" | "DOCTOR" | "COMMANDER" | null;

type AuthContextType = {
  token: string | null;
  role: Role;
  login: (token: string, role: Role) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  role: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [role, setRole] = useState<Role>(
    (localStorage.getItem("role") as Role) || null
  );

  const login = (token: string, role: Role) => {
    setToken(token);
    setRole(role);
    localStorage.setItem("token", token);
    localStorage.setItem("role", role || "");
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
