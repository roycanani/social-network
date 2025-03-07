import axios from "axios";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { User } from "./model";
import { parseJwt } from "./lib/utils";

// Updated types
type AuthState = {
  token: string | null;
  user: (User & { image: string }) | null;
};

type AuthDispatch = {
  setToken: (token: string | null) => void;
};

type AuthProviderProps = {
  children: ReactNode;
  initialState?: AuthState;
};

const AuthContext = createContext<AuthState | null>(null);
const AuthDispatchContext = createContext<AuthDispatch | null>(null);

const AuthProvider = ({
  children,
  initialState = { token: null, user: null },
}: AuthProviderProps) => {
  const [authState, setAuthState] = useState<AuthState>(initialState);

  const setToken = (token: string | null) => {
    const tokenUser = parseJwt(token);
    setAuthState({
      token,
      user: {
        email: tokenUser?.email || "",
        image: tokenUser?.image || "",
        userName: tokenUser?.username || "",
      },
    });
  };

  useEffect(() => {
    axios.defaults.baseURL = "http://localhost:3000";
    const interceptorId = axios.interceptors.request.use((config) => {
      if (authState.token) {
        config.headers.Authorization = `Bearer ${authState.token}`;
      }
      return config;
    });

    return () => {
      axios.interceptors.request.eject(interceptorId);
    };
  }, [authState.token]);

  return (
    <AuthContext.Provider value={authState}>
      <AuthDispatchContext.Provider value={{ setToken }}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthContext.Provider>
  );
};

// Updated hooks
const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const useAuthDispatch = () => {
  const context = useContext(AuthDispatchContext);
  if (context === null) {
    throw new Error("useAuthDispatch must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth, useAuthDispatch };
