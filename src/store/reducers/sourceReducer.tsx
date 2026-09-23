import { Source, SourceState } from "@/types";
import { INTERNAL_EVENTS } from "../constants";
import { EVENTS } from "@/constants/events";

const initialState: SourceState = {
  directory: [],
  source: {
    uri: "",
    controls: [],
    active: false,
    enabled: false,
    index: 0,
    browsable: false,
    state: {},
  },
};

export const sourceReducer = (state = initialState, action: any): SourceState => {
  const { type, payload } = action;

  switch (type) {
    case INTERNAL_EVENTS.SOURCE_DIR:
      return {
        ...state,
        directory: payload.directory,
        source: payload.directory.find((item: Source) => item.active) ?? initialState.source,
      };

    case EVENTS.SOURCE_CHANGED:
    case EVENTS.SOURCE_UPDATED:
      return {
        ...state,
        directory: state.directory.map((item: Source) =>
          item.uri === payload.source.uri ? { ...payload.source, active: true } : { ...item, active: false },
        ),
        source: payload.source,
      };

    default:
      return state;
  }
};
