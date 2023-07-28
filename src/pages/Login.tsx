import React, { FC, useEffect } from "react";
import { Typography, Space, Form, Input, Button, Checkbox } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import styles from "./Login.module.scss";
import { Link } from "react-router-dom";
import { REGISTER_PATHNAME } from "../router";

const { Title } = Typography;

const USERNAME_KEY = "USERNAME";
const PASSWORD_KEY = "PASSWORD";
function rememberUser(username: string, password: string) {
  localStorage.setItem(USERNAME_KEY, username);
  localStorage.setItem(PASSWORD_KEY, password);
}

function deleteUserFromStorage() {
  localStorage.removeItem(USERNAME_KEY);
  localStorage.removeItem(PASSWORD_KEY);
}

function getUserInfoStorage() {
  return {
    username: localStorage.getItem(USERNAME_KEY),
    password: localStorage.getItem(PASSWORD_KEY),
  };
}

const Login: FC = () => {
  function onFinish(values: any) {
    const { username, password, remember } = values;
    if (remember) {
      rememberUser(username, password);
    } else {
      deleteUserFromStorage();
    }
  }
  function onFinishFailed(errorInfo: any) {
    console.log("Failed:", errorInfo);
  }

  const [form] = Form.useForm()
  useEffect(() => {
    const { username, password } = getUserInfoStorage();
    form.setFieldsValue({ username, password })
  }, []);

  return (
    <div className={styles.container}>
      <div>
        <Space>
          <Title level={2}>
            <UserAddOutlined />
          </Title>
          <Title level={2}>用户登录</Title>
        </Space>
      </div>
      <div>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          form={form}
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: "请输入你的用户名" }]}
          >
            <Input placeholder="用户名" />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: "请输入你的密码" }]}
          >
            <Input.Password placeholder="密码" />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{ offset: 8, span: 16 }}
          >
            <Checkbox>记住我</Checkbox>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Space>
              <Button type="primary" htmlType="submit">
                登录
              </Button>
              <Link to={REGISTER_PATHNAME}>注册新用户</Link>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
