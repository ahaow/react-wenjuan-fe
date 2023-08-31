import React, { FC, useState } from "react";
import styles from "./QuestionCard.module.scss";
import { Button, Space, Divider, Tag, Popconfirm, Modal, message } from "antd";
import {
  EditOutlined,
  LineChartOutlined,
  StarOutlined,
  CopyOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { useRequest } from "ahooks";
import {
  duplicateQuestionService,
  updateQuestionService,
} from "../services/question";

type PropsType = {
  _id: string;
  title: string;
  isStar: boolean;
  isPublished: boolean;
  answerCount: number;
  createAt: string;
};

const { confirm } = Modal;

const QuestionCard: FC<PropsType> = (props: PropsType) => {
  const { _id, title, isPublished, answerCount, createAt, isStar } = props;
  const nav = useNavigate();

  // 修改标星
  const [isStarState, setIsStarState] = useState(isStar);
  const { loading: changeStarLoading, run: changeStar } = useRequest(
    async () => {
      await updateQuestionService(_id, { isStar: !isStarState });
    },
    {
      manual: true,
      onSuccess() {
        setIsStarState(!isStarState);
        message.success("已更新");
      },
    }
  );

  // 复制
  const { loading: duplicateLoading, run: duplicate } = useRequest(
    async () => {
      const data = await duplicateQuestionService(_id);
      return data;
    },
    {
      manual: true,
      onSuccess(result) {
        const { id = "" } = result;
        message.success("复制成功");
        nav(`/question/edit/${id}`);
      },
    }
  );

  const [isDeletedState, setIsDeletedState] = useState(false);
  const { loading: deleteLoading, run: delQuestion } = useRequest(
    async () => await updateQuestionService(_id, { isDeleted: true }),
    {
      manual: true,
      onSuccess() {
        message.success("删除成功");
        setIsDeletedState(true);
      },
    }
  );

  function del() {
    confirm({
      title: "确定删除该问卷?",
      cancelText: "取消",
      okText: "确定",
      icon: <ExclamationCircleOutlined />,
      onOk: () => {
        delQuestion();
      },
    });
  }

  // 已经删除的问卷不显示
  if (isDeletedState) return null;
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <div className={styles.left}>
          <Link
            to={isPublished ? `/question/stat/${_id}` : `/question/edit/${_id}`}
          >
            <Space>
              {isStarState && <StarOutlined style={{ color: "red" }} />} {title}
            </Space>
          </Link>
        </div>
        <div className={styles.right}>
          <Space>
            {isPublished ? (
              <Tag color="processing">已发布</Tag>
            ) : (
              <Tag>未发布</Tag>
            )}
            <span>答卷: {answerCount}</span>
            <span>{createAt}</span>
          </Space>
        </div>
      </div>
      <Divider style={{ margin: "12px 0" }} />
      <div className={styles["button-container"]}>
        <div className={styles.left}>
          <Space>
            <Button
              icon={<EditOutlined />}
              type="text"
              size="small"
              onClick={() => nav(`/question/edit/${_id}`)}
            >
              编辑问卷
            </Button>
            <Button
              icon={<LineChartOutlined />}
              type="text"
              size="small"
              onClick={() => nav(`/question/stat/${_id}`)}
              disabled={!isPublished}
            >
              数据统计
            </Button>
          </Space>
        </div>
        <div className={styles.right}>
          <Space>
            <Button
              icon={<StarOutlined />}
              type="text"
              size="small"
              onClick={changeStar}
              disabled={changeStarLoading}
            >
              {isStarState ? "取消标星" : "标星"}
            </Button>
            <Popconfirm
              title="确定复制该问卷"
              okText="确定"
              cancelText="取消"
              onConfirm={duplicate}
            >
              <Button
                icon={<CopyOutlined />}
                type="text"
                size="small"
                disabled={duplicateLoading}
              >
                复制
              </Button>
            </Popconfirm>

            <Button
              icon={<DeleteOutlined />}
              type="text"
              size="small"
              disabled={deleteLoading}
              onClick={del}
            >
              删除
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
