import React, { FC, useState, useEffect } from "react";
import { Space, Typography } from "antd";
import { Link } from "react-router-dom";
import { FormOutlined } from "@ant-design/icons";
import styles from "./Logo.module.scss";
import useGuseGetUserInfo from "./../hooks/useGetUserInfo";
import { HOME_PATHNAME, MANAGE_INDEX_PATHNAME } from "../router";

const { Title } = Typography;

const Logo: FC = () => {
  const { username } = useGuseGetUserInfo();
  const [pathname, setPathname] = useState(HOME_PATHNAME);

  useEffect(() => {
    if (username) {
      setPathname(MANAGE_INDEX_PATHNAME);
    }
  }, [username]);

  return (
    <div className={styles.container}>
      <Link to={pathname}>
        <Space>
          <Title>
            <FormOutlined />
          </Title>
          <Title>元素问卷</Title>
        </Space>
      </Link>
    </div>
  );
};

export default Logo;
