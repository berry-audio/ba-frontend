import { EVENTS } from "@/constants/events";

interface TunerState {
  channel: number;
}

const initialState: TunerState = {
  channel: 875,
};

export const tunerReducer = (
  state = initialState,
  action: any
): TunerState => {
  const { type, payload } = action;

  switch (type) {
    case EVENTS.TUNER_CHANNEL_UPDATED:
      return { ...state, channel: payload.channel };
    default:
      return state;
  }
};
