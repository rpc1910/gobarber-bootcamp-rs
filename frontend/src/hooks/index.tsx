import React from 'react';
import { AuthProvider } from './auth';
import { ToastProvider } from './toast';

// import { Container } from './styles';

const AppProvider: React.FC = ({ children }) => {
  return (
    <ToastProvider>
      <AuthProvider>{children}</AuthProvider>
    </ToastProvider>
  );
};

export default AppProvider;
