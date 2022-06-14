import './styles.css';

import { LoginForm } from '../../components/LoginForm';

import { Layout } from 'antd';
const { Content } = Layout;

export const Login = () => {
  return (
    <Content className="content">
      <LoginForm className="form" />
    </Content>
  );
};
