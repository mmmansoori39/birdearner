import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState({
    isLoading: true,
    isSignedIn: false,
    userToken: null,
  });

  useEffect(() => {
    setTimeout(() => {
      const userToken = true; 
      setState({
        isLoading: false,
        isSignedIn: !!userToken,
        userToken,
      });
    }, 2000); 
  }, []);

  const signIn = (token) => {
    setState({
      isSignedIn: true,
      isLoading: false,
      userToken: token,
    });
  };

  const signOut = () => {
    setState({
      isSignedIn: false,
      isLoading: false,
      userToken: null,
    });
  };

  return (
    <AuthContext.Provider value={{ state, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
