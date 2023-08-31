import React, { FC, useEffect, useState, useRef } from "react";
import { Typography, Spin, Empty } from "antd";
import { useTitle, useDebounceFn, useRequest } from "ahooks";
import { useSearchParams } from "react-router-dom";
import styles from "./common.module.scss";
import QuestionCard from "../../components/QuestionCard";
import ListSearch from "../../components/ListSearch";
import { getQuestionListService } from "../../services/question";
import { LIST_PAGE_SIZE, LIST_SEARCH_PARAM_KEY } from "../../constant";
// import useLoadQuestionListData from "../../hooks/useLoadQuestionListData";

const { Title } = Typography;

const List: FC = () => {
  useTitle("我的问卷");
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get(LIST_SEARCH_PARAM_KEY) || ""
  // const { data = {}, loading, error } = useLoadQuestionListData();
  // const { list = [], total = 0 } = data;
  const [started, setStarted] = useState(false) // 是否已经加载
  const [page, setPage] = useState(1);
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);

  const haveMoreData = total > list.length;

  // 加载函数
  const { run: load, loading } = useRequest(
    async () => {
      const data = await getQuestionListService({
        page,
        pageSize: LIST_PAGE_SIZE,
        keyword
      });
      return data;
    },
    {
      manual: true,
      onSuccess(result) {
        const { list: l = [], total = 0 } = result;
        setList(list.concat(l));
        setTotal(total);
        setPage(page + 1);
      },
    }
  );

  // 触发加载
  const containerRef = useRef<HTMLDivElement>(null);
  const { run: tryLoadMore } = useDebounceFn(
    () => {
      const ele = containerRef.current;
      if (ele == null) return;
      const domRect = ele.getBoundingClientRect();
      if (domRect == null) return;
      if (domRect.bottom <= document.documentElement.clientHeight) {
        console.log("执行加载");
        setStarted(true)
        load();
      }
    },
    { wait: 1000 }
  );

  const loadMoreContentElem = () => {
    if (!started || loading) return <Spin />;
    if (total === 0) return <Empty description="暂无数据" />;
    if (!haveMoreData) return <span>没有更多了...</span>;
    return <span>开始加载下一页</span>;
  };

  // 当页面加载或者url参数变化时，触发加载
  useEffect(() => {
    tryLoadMore();
  }, [searchParams]);

  useEffect(() => {
    if (haveMoreData) {
      window.addEventListener("scroll", tryLoadMore);
    }
    return () => {
      window.removeEventListener("scroll", tryLoadMore);
    };
  }, [searchParams, haveMoreData]);

  useEffect(() => {
    setStarted(false)
    setPage(1)
    setList([])
    setTotal(0)
  }, [keyword])
  

  return (
    <>
      <div className={styles.header}>
        <div className={styles.left}>
          <Title level={3}>我的问卷</Title>
        </div>
        <div className={styles.right}>
          <ListSearch />
        </div>
      </div>
      <div className={styles.content}>
        {/** 问卷列表 */}
        {list.length > 0 &&
          list.map((q: any) => {
            const { _id } = q;
            return <QuestionCard key={_id} {...q} />;
          })}
      </div>
      <div className={styles.footer}>
        <div ref={containerRef}>{loadMoreContentElem()}</div>
      </div>
    </>
  );
};

export default List;
