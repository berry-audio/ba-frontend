import { EVENTS } from "@/constants/events";

interface DspState {
  config: Object | null;
}

const initialDspState: DspState = {
  config: null,
};

export const dspReducer = (state = initialDspState, action: any): DspState => {
  const { type, payload } = action;

  switch (type) {
    case EVENTS.DSP_STATE_CHANGED:
      return {
        config: payload.config,
      };

    default:
      return state;
  }
};
