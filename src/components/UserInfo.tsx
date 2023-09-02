import React, { FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { LOGIN_PATHNAME } from "../router";
import { removeToken } from "../utils/user-token";
import useGuseGetUserInfo from "./../hooks/useGetUserInfo";
import { useDispatch } from "react-redux";
import { logoutReducer } from "./../store/userReducer";

const UserInfo: FC = () => {
  // const { data } = useRequest(getUserInfoService);
  // const { username, nickname } = data || {};

  const { username, nickname } = useGuseGetUserInfo();
  const nav = useNavigate();
  const dispatch = useDispatch();

  function logout() {
    dispatch(logoutReducer); // 清空redux user 数据
    removeToken(); // 清除token
    message.success("退出成功");
    nav(LOGIN_PATHNAME);
  }

  const UserInfo = (
    <>
      <span style={{ color: "#e8e8e8" }}>
        <UserOutlined /> {nickname}
      </span>
      <Button type="link" onClick={logout}>
        退出
      </Button>
    </>
  );

  const Login = (
    <>
      <Link to={LOGIN_PATHNAME}>登录</Link>
    </>
  );

  return <>{username ? UserInfo : Login}</>;
};

export default UserInfo;
