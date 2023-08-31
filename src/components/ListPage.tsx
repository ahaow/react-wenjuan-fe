import React, { FC, useEffect, useState } from "react";
import { Pagination } from "antd";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import {
  LIST_PAGE_PARAM_KEY,
  LIST_PAGE_SIZE,
  LIST_PAGE_SIZE_PARAM_KEY,
} from "../constant";

type PropsType = {
  total: number;
};

const ListPage: FC<PropsType> = (props: PropsType) => {
  const { total } = props;
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(LIST_PAGE_SIZE);

  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();

  function handlePageChange(page: number, pageSize: number) {
    searchParams.set(LIST_PAGE_PARAM_KEY, page.toString())
    searchParams.set(LIST_PAGE_SIZE_PARAM_KEY, pageSize.toString())
    nav({
        pathname,
        search: searchParams.toString(),
    });
  }

  useEffect(() => {
    const page = parseInt(searchParams.get(LIST_PAGE_PARAM_KEY) || "") || 1;
    const pageSize =
      parseInt(searchParams.get(LIST_PAGE_SIZE_PARAM_KEY) || "") ||
      LIST_PAGE_SIZE;
    setCurrent(page);
    setPageSize(pageSize);
  }, [searchParams]);
  return (
    <Pagination
      total={total}
      current={current}
      pageSize={pageSize}
      onChange={handlePageChange}
    />
  );
};

export default ListPage;
