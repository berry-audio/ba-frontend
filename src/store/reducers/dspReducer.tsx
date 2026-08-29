import { EVENTS } from "@/constants/events";
import { DspConfig } from "@/views/Dsp/types";

export interface DspState {
  config: DspConfig;
}

const initialDspState: DspState = {
  config: {
    title: null,
    description: null,
    devices: {
      samplerate: 44100,
      chunksize: 1024,
      queuelimit: null,
      silence_threshold: null,
      silence_timeout: null,
      capture: {
        type: "Alsa",
        channels: 2,
        device: "",
        format: null,
        stop_on_inactive: null,
        link_volume_control: null,
        link_mute_control: null,
        labels: null,
      },
      playback: {
        type: "Alsa",
        channels: 2,
        device: "",
        format: null,
      },
      enable_rate_adjust: null,
      target_level: null,
      adjust_period: null,
      resampler: null,
      capture_samplerate: null,
      stop_on_rate_change: null,
      rate_measure_interval: null,
      volume_ramp_time: null,
      volume_limit: null,
      multithreaded: false,
      worker_threads: null,
    },
    mixers: {},
    filters: {},
    processors: {},
    pipeline: [],
  },
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
