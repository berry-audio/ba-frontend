import { RoomState } from "@/types";
import { INTERNAL_EVENTS } from "../constants";
import { EVENTS } from "@/constants/events";

const initialState: RoomState = {
  servers: [],
};

export const multiroomReducer = (state = initialState, action: any): RoomState => {
  const { type, payload } = action;

  switch (type) {
    case INTERNAL_EVENTS.MULTIROOM_SCAN_COMPLETED:
    case INTERNAL_EVENTS.MULTIROOM_LIST:
      return {
        ...state,
        servers: payload,
      };

    case EVENTS.MULTIROOM_SERVER_ADDED:
    case EVENTS.MULTIROOM_SERVER_UPDATED:
    case EVENTS.MULITROOM_SERVER_CONNECTED:
    case EVENTS.MULITROOM_SERVER_DISCONNECTED:
      console.log(type, payload);
      return {
        ...state,
        servers: [...state.servers.filter((server) => server?.service_name !== payload.server?.service_name), payload.server],
      };

    default:
      return state;
  }
};
