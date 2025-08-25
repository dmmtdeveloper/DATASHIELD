import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un usuario guardado en localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

 const login = async (email: string, password: string): Promise<boolean> => {
  setIsLoading(true);
  try {
    // Simulación de API call - reemplazar con llamada real
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Validación simple para demo
    if (email === 'admin@zurich.com' && password === 'admin123') {
      const userData: User = {
        id: '1',
        email: email,
        name: 'Administrador',
        role: 'admin'
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    } else if (email.includes('@') && password.length >= 6) {
      const userData: User = {
        id: '2',
        email: email,
        name: email.split('@')[0],
        role: 'user'
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error en login:', error);
    return false;
  } finally {
    setIsLoading(false);
  }
};


  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulación de API call - reemplazar con llamada real
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validación simple para demo
      if (name.length >= 2 && email.includes('@') && password.length >= 6) {
        const userData: User = {
          id: Date.now().toString(),
          email: email,
          name: name,
          role: 'user'
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error en registro:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    register,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};