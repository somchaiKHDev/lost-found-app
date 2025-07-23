import { createContext } from "react";

interface AuthContextProps {
  user: any | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: true,
});
