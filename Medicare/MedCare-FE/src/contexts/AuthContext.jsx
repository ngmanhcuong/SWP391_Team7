import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

const MOCK_USER = {
  fullName: 'Nguyễn Thị Tâm An',
  role: 'Bệnh nhân',
  email: 'taman.nguyen@medcare.vn',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(MOCK_USER);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login: (nextUser) => setUser(nextUser),
      logout: () => setUser(null),
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
