import { useState } from 'react';

import { useAuth } from '../hooks/auth';

// ROUTES
import { UserRoutes } from './user.routes';
import { AuthRoutes } from './auth.routes';

// ASSETS
import TractianIcon from '../assets/logo.svg';

// ANTD
import { Layout } from 'antd';
const { Header } = Layout;

export const AppRoutes = () => {
  const { user } = useAuth();

  if (user)
    return (
      <Layout>
        <Header className="header">
          <img src={TractianIcon} alt="Logo da empresa Tractian" />
          <h2>Bem vindo, {user.name}!</h2>
        </Header>
        <UserRoutes />
      </Layout>
    );

  return (
    <Layout>
      <Header className="header">
        <img src={TractianIcon} alt="Logo da empresa Tractian" />
      </Header>
      <AuthRoutes />
    </Layout>
  );
};
