import React, { FC, useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { Input, Space } from "antd";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { LIST_SEARCH_PARAM_KEY } from "../constant";

const { Search } = Input;

const ListSearch: FC = () => {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const [value, setValue] = useState("");

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setValue(event.target.value);
  }

  // 获取 url 参数， 并设置到 input value
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const curVal = searchParams.get(LIST_SEARCH_PARAM_KEY) || ''
    setValue(curVal)
  }, [searchParams]);

  function handleSearch(value: string) {
    // 跳转页面, 增加 url 参数
    nav({
      pathname: pathname,
      search: `${LIST_SEARCH_PARAM_KEY}=${value}`,
    });
  }

  return (
    <div>
      <Search
        placeholder="输入关键字"
        allowClear
        value={value}
        onChange={handleChange}
        onSearch={handleSearch}
        style={{ width: 200 }}
      />
    </div>
  );
};

export default ListSearch;
