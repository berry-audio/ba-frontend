import { useDispatch, useSelector } from "react-redux";
import { DRAWER_EVENTS } from "@/store/constants";

import Drawer from ".";
import LocalDetail from "@/views/Local/LocalDetail";

const DrawerLocalDetail = () => {
  const dispatch = useDispatch();
  const { drawer, payload } = useSelector((state: any) => state.drawer);

  const onClickHandler = () => {
    dispatch({
      type: DRAWER_EVENTS.DRAWER_CLOSE,
      payload: null,
    });
  };

  return (
    <Drawer open={drawer === DRAWER_EVENTS.DRAWER_LOCAL} onClick={onClickHandler}>
      <LocalDetail ext={payload?.ext} view={payload?.view} id={payload?.id} />
    </Drawer>
  );
};

export default DrawerLocalDetail;
