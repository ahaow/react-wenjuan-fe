import { useState, useEffect } from "react";
import { useRequest } from "ahooks";
import { useDispatch } from "react-redux";
import useGuseGetUserInfo from "./useGetUserInfo";
import { getUserInfoService } from "../services/user";
import { loginReducer } from "../store/userReducer";

function useLoadUserData() {
  const [waitingUserData, setWaitingUserData] = useState(true);
  const dispatch = useDispatch();

  const { run } = useRequest(getUserInfoService, {
    manual: true,
    onSuccess(result) {
      const { username, nickname } = result;
      // 存储到redux中
      dispatch(loginReducer({ username, nickname }));
    },
    onFinally() {
      setWaitingUserData(false)
    },
  });

  // 判断redux是否存在用户信息
  const { username } = useGuseGetUserInfo();
  useEffect(() => {
    if (username) {
      setWaitingUserData(false); // 如果存在，不用加载
      return;
    }
    // 如果没有，则进行加载
    run();
  }, [username]);

  return {
    waitingUserData,
  };
}

export default useLoadUserData;
