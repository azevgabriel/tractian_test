import './styles.css';

import { LoginForm } from '../../components/LoginForm';

import { Layout } from 'antd';
const { Content } = Layout;

export const Login = () => {
  const returnCodeText = () => {
    const tab = '\xA0\xA0';
    const openKey = '{';
    const closeKey = '}';
    const openbracket = '[';
    const closebracket = ']';

    const code = ['', `${openbracket}`, `${tab + openKey}`];

    for (let i = 1; i < 7; i++) {
      let objectExample = [
        `${tab + tab + `"id": ${i},`}`,
        `${tab + tab + `"email": "teste${i}@tractian.com",`}`,
        `${tab + tab + '...'}`,
        `${tab + closeKey + `${i === 6 ? '' : ','}`}`,
      ];

      code.push(...objectExample);
    }

    code.push(`${closebracket}`);

    return code;
  };

  return (
    <Content className="content">
      <div className="codeArea">
        <p>
          Bem vindo! Para começar, utilize algum email dado pelo{' '}
          <a href="https://github.com/tractian/fake-api">Fake API</a> da
          Tractian.
        </p>
        <div className="code">
          <span style={{ color: 'var(--color-text-code-comment)' }}>
            // Method: GET
          </span>
          <br />
          <span style={{ color: 'var(--color-text-code-comment)' }}>
            // https://my-json-server.typicode.com/tractian/fake-api/users
          </span>
          <br />
          {returnCodeText().map((line, index) => (
            <>
              <span key={index}>{line}</span>
              <br />
            </>
          ))}
        </div>
        <p>
          Obs: O usuário entra sem nenhuma prioridade, entretando no canto
          inferior esquerdo, você conseguirá acessar a visão do usuário tipo
          administrador.
        </p>
      </div>
      <div className="loginArea">
        <LoginForm className="form" />
      </div>
    </Content>
  );
};
