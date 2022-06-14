import { useEffect, useState } from 'react';

import { Form, Input, Button, Checkbox } from 'antd';
import { useAuth } from '../hooks/auth';

type ValidateStatus = Parameters<typeof Form.Item>[0]['validateStatus'];

interface ValuesForm {
  email: string;
  remember: boolean;
}

interface LoginFormProps {
  className: string;
}

export const LoginForm = ({ className }: LoginFormProps) => {
  const { signIn } = useAuth();

  const [validateStatus, setValidateStatus] = useState<ValidateStatus>('');

  const onFinish = async (values: ValuesForm) => {
    setValidateStatus('validating');

    try {
      await signIn(values.email);
    } catch (error) {
      setValidateStatus('error');

      setTimeout(() => {
        setValidateStatus('');
      }, 2000);

      return;
    }

    setValidateStatus('success');
  };

  return (
    <Form
      name="basic"
      labelCol={{ offset: 1, span: 5 }}
      wrapperCol={{ span: 15 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      autoComplete="off"
      className={className}
    >
      <h1>Login</h1>
      <Form.Item
        label="E-mail"
        name="email"
        hasFeedback
        validateStatus={validateStatus}
        rules={[
          {
            required: true,
            type: 'email',
            message: 'Por-favor utilize um e-mail válido.',
          },
        ]}
      >
        <Input placeholder="Insira seu e-mail" />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 18, span: 15 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
