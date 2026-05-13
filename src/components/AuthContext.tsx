import React, { createContext, useContext, useEffect, useState } from 'react';

export interface CustomUser {
  id: string;
  email: string;
}

interface AuthContextType {
  user: CustomUser | null;
  loading: boolean;
  signIn: (user: CustomUser) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for existing session
    const storedUserId = localStorage.getItem('custom_user_id');
    const storedUserEmail = localStorage.getItem('custom_user_email');
    
    if (storedUserId && storedUserEmail) {
      setUser({ id: storedUserId, email: storedUserEmail });
    }
    
    setLoading(false);
  }, []);

  const signIn = (newUser: CustomUser) => {
    localStorage.setItem('custom_user_id', newUser.id);
    localStorage.setItem('custom_user_email', newUser.email);
    setUser(newUser);
  };

  const signOut = () => {
    localStorage.removeItem('custom_user_id');
    localStorage.removeItem('custom_user_email');
    setUser(null);
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
