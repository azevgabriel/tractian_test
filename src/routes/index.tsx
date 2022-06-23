import { useAuth } from '../hooks/auth';
import { LogoutOutlined } from '@ant-design/icons';

// ROUTES
import { UserRoutes } from './user.routes';
import { AuthRoutes } from './auth.routes';

// ASSETS
import TractianIcon from '../assets/logo.svg';

// ANTD
import { Button, Layout } from 'antd';
const { Header } = Layout;

export const AppRoutes = () => {
  const { user, signOut } = useAuth();

  if (user)
    return (
      <Layout>
        <Header className="header">
          <img src={TractianIcon} alt="Logo da empresa Tractian" />
          <div className="rightContentHeader">
            <p>
              Bem vindo, <strong>{user.name}!</strong>
            </p>
            <Button
              type="link"
              size="large"
              icon={<LogoutOutlined />}
              onClick={() => signOut()}
              style={{
                color: '#eee',
              }}
            />
          </div>
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
