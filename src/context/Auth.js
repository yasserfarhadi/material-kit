import React from 'react';

const AuthContext = React.createContext();

const useAuthContext = () => React.useContext(AuthContext);

const AuthWrapper = ({ children }) => {
  const [authenticated, setAuthenticated] = React.useState(() => localStorage.getItem('login') || false);

  const setAuthState = (stayLoggedIn) => {
    console.log(stayLoggedIn);
    if (stayLoggedIn) {
      localStorage.setItem('login', true);
    }
    setAuthenticated(true);
  };

  return <AuthContext.Provider value={{ authenticated, setAuthState }}>{children}</AuthContext.Provider>;
};

export { useAuthContext, AuthWrapper };
