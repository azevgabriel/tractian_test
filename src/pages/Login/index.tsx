import './styles.css';

import { LoginForm } from '../../components/LoginForm';

import { Layout } from 'antd';
const { Content } = Layout;

export const Login = () => {
  return (
    <Content className="content">
      <div className="codeArea">
        <p>
          Bem vindo! Para começar, utilize algum email dados pelo{' '}
          <a href="https://github.com/tractian/fake-api">Fake API</a> da
          Tractian.
        </p>
        <div className="code">
          // Method: GET <br />
          // https://my-json-server.typicode.com/tractian/fake-api/users
          <br />
          <br /> &#91;
          <br />
          &nbsp;&nbsp;&#123;
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;"id": 1,
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;"email": teste1@tractian.com,
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;...
          <br />
          &nbsp;&nbsp;&#125;,
          <br />
          &nbsp;&nbsp;&#123;
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;"id": 2,
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;"email": teste1@tractian.com,
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;...
          <br />
          &nbsp;&nbsp;&#125;,
          <br />
          &nbsp;&nbsp;&#123;
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;"id": 3,
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;"email": teste1@tractian.com,
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;...
          <br />
          &nbsp;&nbsp;&#125;,
          <br />
          &nbsp;&nbsp;&#123;
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;"id": 4,
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;"email": teste1@tractian.com,
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;...
          <br />
          &nbsp;&nbsp;&#125;,
          <br />
          &nbsp;&nbsp;&#123;
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;"id": 5,
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;"email": teste1@tractian.com,
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;...
          <br />
          &nbsp;&nbsp;&#125;,
          <br />
          &nbsp;&nbsp;&#123;
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;"id": 6,
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;"email": teste1@tractian.com,
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;...
          <br />
          &nbsp;&nbsp;&#125;,
          <br /> &#93;
        </div>
        <p>
          Obs: O usuário entra sem nenhuma prioridade, entretando no canto
          inferior esquerdo, você conseguirá acessar a visão do usuário tipo
          administrador.
        </p>
      </div>
      <LoginForm className="form" />
    </Content>
  );
};
