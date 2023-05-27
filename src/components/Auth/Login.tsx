import React from 'react';
import { useHistory } from 'react-router-dom';
import { message, Button, Form, Input } from 'antd';

import * as service from './core/service';
import { ILogin, ILoginResponse } from './core/types';
import { STORAGE_ACCESS_TOKEN, STORAGE_MOBILE, STORAGE_REFRESH_TOKEN, STORAGE_USERNAME } from '../_common/core/constants';

export default function Login() {
  const history = useHistory();

  function loginRequest(body: ILogin) {
    service
    .login(body)
    .then((res: ILoginResponse) => {
      localStorage.setItem(STORAGE_USERNAME, res.username)
      localStorage.setItem(STORAGE_ACCESS_TOKEN, res.accessToken);
      localStorage.setItem(STORAGE_REFRESH_TOKEN, res.refreshToken);
      localStorage.setItem(STORAGE_MOBILE, `${res.mobile}`);
    })
    .catch((error) => {
      message.error(error.message);
    })
    .finally(() => {
      if (localStorage.getItem(STORAGE_ACCESS_TOKEN)) {
        history.push('/course');
        history.go(0);
      }
    });
  }

  const onFinish = async (values: any) => {
    const body: ILogin = {
      username: values.username,
      password: values.password
    };

    loginRequest(body);
  };

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 4 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Username required!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Password required!' }]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
