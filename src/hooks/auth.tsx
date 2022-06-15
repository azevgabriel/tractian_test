import {
  createContext,
  useCallback,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from 'react';
import { IUser } from '../interfaces/User';
import { api } from '../lib/api';

interface AuthContextData {
  signIn: (email: string) => Promise<void>;
  user: IUser | null;
  signOut: () => void;
  changeTypeUser: (type: 'user' | 'admin') => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<IUser | null>(null);

  const signIn = useCallback(async (email: string) => {
    const getUsers = await api.get<IUser[]>('/users');
    const userData = getUsers.data.find((user) => user.email === email);

    if (!userData) throw new Error('Usuário não encontrado');

    const userWithType = {
      ...userData,
      type: 'user',
    };

    localStorage.setItem('@Tractian:USER', JSON.stringify(userWithType));
    setUser(userWithType as IUser);
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@Tractian:USER');
    setUser(null);
  }, []);

  const changeTypeUser = useCallback(
    (type: 'admin' | 'user') => {
      const userWithType = {
        ...user,
        type,
      };
      localStorage.setItem('@Tractian:USER', JSON.stringify(userWithType));
      setUser(userWithType as IUser);
    },
    [user]
  );

  useEffect(() => {
    const userString = localStorage.getItem('@Tractian:USER');
    console.log(user);

    if (userString && !user) {
      setUser(JSON.parse(userString));
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        user,
        changeTypeUser,
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
