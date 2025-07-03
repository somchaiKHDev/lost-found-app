import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const apiUrl = import.meta.env.VITE_API_URL;

interface AuthContextProps {
  user: any | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = () => {
    axios
      .get(`${apiUrl}/auth/verify`, {
        withCredentials: true,
      })
      .then((response) => {
        setUser(response.data);
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      })
  };

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);