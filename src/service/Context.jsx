import React, { createContext, useContext, useState } from 'react';

// Create a context with an initial value (null in this case)
const AuthContext = createContext(null);

// Create a provider component that wraps your app
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout,setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to use the AuthContext in your components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
