import './styles.css';

import { LoginForm } from '../../components/LoginForm';

import { Layout } from 'antd';
const { Content } = Layout;

import CompanyImage from '../../assets/company.svg';

export const Login = () => {
  return (
    <Content className="content">
      <img
        src={CompanyImage}
        alt="Imagem ilustrativa dos serviços da Tractian."
      />
      <LoginForm className="form" />
    </Content>
  );
};
