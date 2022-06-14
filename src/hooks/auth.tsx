import {
  createContext,
  useCallback,
  useContext,
  ReactNode,
  useState,
} from 'react';
import { IUser } from '../interfaces/User';
import { api } from '../lib/api';

interface AuthContextData {
  signIn: (email: string) => Promise<void>;
  user: IUser | null;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<IUser | null>(null);

  const signIn = useCallback(async (email: string) => {
    const getUsers = await api.get<IUser[]>('/users');
    const user = getUsers.data.find((user) => user.email === email);

    if (!user) throw new Error('Usuário não encontrado');

    setUser(user);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export { AuthProvider, useAuth };
