import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('neir_admin_user');
      return saved ? JSON.parse(saved) : {
        id: 'usr-1',
        fullName: 'Md. Anwarul Kabir',
        username: 'admin.btrc',
        email: 'anwarul.kabir@btrc.gov.bd',
        role: 'Super Admin',
        designation: 'Director General',
        department: 'Engineering and Operations Division'
      };
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem('neir_admin_auth') || 'true');
  });

  const login = async (username, password) => {
    if (!username || !password) {
      throw new Error('Please enter both username and password.');
    }
    const mockUser = {
      id: 'usr-1',
      fullName: username === 'admin' ? 'Md. Anwarul Kabir' : username,
      username: username,
      email: `${username}@btrc.gov.bd`,
      role: 'Super Admin',
      designation: 'Director General',
      department: 'Engineering and Operations Division'
    };
    setUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem('neir_admin_user', JSON.stringify(mockUser));
    localStorage.setItem('neir_admin_auth', 'true');
    return mockUser;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('neir_admin_user');
    localStorage.removeItem('neir_admin_auth');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
