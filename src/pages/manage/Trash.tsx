import React, { FC, useState } from "react";
import {
  Typography,
  Empty,
  Table,
  Tag,
  Button,
  Space,
  Modal,
  Spin,
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useTitle } from "ahooks";
import ListSearch from "../../components/ListSearch";
import styles from "./common.module.scss";
import useLoadQuestionListData from "../../hooks/useLoadQuestionListData";

const { Title } = Typography;
const { confirm } = Modal;

const columns = [
  {
    title: "标题",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "是否发布",
    dataIndex: "isPublished",
    key: "isPublished",
    render: (text: any) => {
      return text ? <Tag color="processing">已发布</Tag> : <Tag>未发布</Tag>;
    },
  },
  {
    title: "答卷数量",
    dataIndex: "answerCount",
    key: "answerCount",
  },
  {
    title: "创建时间",
    dataIndex: "createAt",
    key: "createAt",
  },
];
const Trash: FC = () => {
  useTitle("回收站");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data = {}, loading, error } = useLoadQuestionListData({isDeleted: true});
  const { list = [], total = 0 } = data;

  const rowSelection = {
    onChange: (selectedRowKeys: any[], selectedRows: any[]) => {
      setSelectedIds(selectedRowKeys as string[]);
      // console.log(
      //   `selectedRowKeys: ${selectedRowKeys}`,
      //   "selectedRows: ",
      //   selectedRows
      // );
    },
  };

  function del() {
    confirm({
      title: "确认彻底删除该问卷?",
      icon: <ExclamationCircleOutlined />,
      cancelText: "取消",
      okText: "确认",
      onOk: () => {
        console.log(6);
      },
    });
  }

  const TableElem = (
    <>
      <div style={{ marginBottom: "16px" }}>
        <Space>
          <Button type="primary" disabled={selectedIds.length === 0}>
            恢复
          </Button>
          <Button danger disabled={selectedIds.length === 0} onClick={del}>
            彻底删除
          </Button>
        </Space>
      </div>
      <Table
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
        key={"key"}
        dataSource={list}
        columns={columns}
        pagination={false}
        rowKey={(q) => q._id}
      />
    </>
  );

  return (
    <>
      <div className={styles.header}>
        <div className={styles.left}>
          <Title level={3}>回收站</Title>
        </div>
        <div className={styles.right}>
          <ListSearch />
        </div>
      </div>
      <div className={styles.content}>
        {loading && (
          <div style={{ textAlign: "center" }}>
            <Spin />
          </div>
        )}
        {/** 问卷列表 */}
        {!loading && list.length === 0 && <Empty description="暂无数据" />}
        {list.length > 0 && TableElem}
      </div>
    </>
  );
};

export default Trash;
