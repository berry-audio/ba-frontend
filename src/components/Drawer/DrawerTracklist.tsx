import { useDispatch, useSelector } from "react-redux";
import { DRAWER_EVENTS } from "@/store/constants";

import Drawer from ".";
import Tracklist from "@/views/Tracklist";

const DrawerTracklist = () => {
  const dispatch = useDispatch();
  const { drawer } = useSelector((state: any) => state.drawer);

  const onClickHandler = () => {
    dispatch({
      type: DRAWER_EVENTS.DRAWER_CLOSE,
      payload: null,
    });
  };

  return (
    <Drawer open={drawer === DRAWER_EVENTS.DRAWER_TRACKLIST} onClick={onClickHandler}>
      <Tracklist />
    </Drawer>
  );
};

export default DrawerTracklist;
