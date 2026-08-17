import { INTERNAL_EVENTS } from "../constants";

interface DspState {
  config: Object | null;
}

const initialDspState: DspState = {
  config: null,
};

export const dspReducer = (state = initialDspState, action: any): DspState => {
  const { type, payload } = action;

  switch (type) {
    case INTERNAL_EVENTS.DSP_CONFIG_STATE:
      return {
        config: payload.config,
      };

    default:
      return state;
  }
};
