import { DRAWER_EVENTS } from "../constants";

interface DrawerState {
  drawer: string | null;
  payload: any;
}

const initialDrawerState: DrawerState = {
  drawer: null,
  payload: null,
};

export const drawerReducer = (state = initialDrawerState, action: any): DrawerState => {
  const { type, payload } = action;

  switch (type) {
    case DRAWER_EVENTS.DRAWER_LOCAL:
      return {
        drawer: DRAWER_EVENTS.DRAWER_LOCAL,
        payload: payload,
      };

    case DRAWER_EVENTS.DRAWER_TRACKLIST:
      return {
        drawer: DRAWER_EVENTS.DRAWER_TRACKLIST,
        payload: null,
      };

    case DRAWER_EVENTS.DRAWER_CLOSE:
      return {
        drawer: null,
        payload: null,
      };

    default:
      return state;
  }
};
