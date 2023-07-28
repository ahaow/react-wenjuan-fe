import React, { FC } from "react";
import { Button, Result } from "antd";
import { useNavigate } from 'react-router-dom'
import { MANAGE_INDEX_PATHNAME } from "../router";

const NotFound: FC = () => {
  const nav = useNavigate()
  return (
    <div style={{
      height: "calc(100vh - 64px - 67px)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    }}>
      <Result
        status="404"
        title="404"
        subTitle="抱歉, 你访问的页面不存在"
        extra={<Button type="primary" onClick={() => nav(MANAGE_INDEX_PATHNAME)}>返回首页</Button>}
      />
    </div>
  );
};

export default NotFound;
