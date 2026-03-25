import { EVENTS } from "@/constants/events";
import { INFO_EVENTS } from "../constants";
import { StorageState } from "@/types";

const initialState: StorageState = {
  last_shared_event: {},
  storages: [],
};

export const storageReducer = (state = initialState, action: any): StorageState => {
  const { type, payload } = action;

  switch (type) {
    case INFO_EVENTS.STORAGE_UPDATED:
      return { ...state, storages: payload };
    case EVENTS.STORAGE_MOUNTED:
    case EVENTS.STORAGE_UNMOUNTED:
      return {
        ...state,
        storages: [...state.storages.filter((s: any) => s.dev !== payload.storage.dev), payload.storage],
      };

    case EVENTS.STORAGE_REMOVED:
      return {
        ...state,
        storages: [...state.storages.filter((s: any) => s.dev !== payload.storage.dev)],
      };

    case EVENTS.STORAGE_SHARED:
    case EVENTS.STORAGE_UNSHARED:
      return {
        ...state,
        last_shared_event: { event: type, uri: payload.uri },
      };

    default:
      return state;
  }
};
