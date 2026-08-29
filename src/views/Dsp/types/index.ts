export enum FILTER_TYPE {
  GAIN = "Gain",
  FLANGER = "Flanger",
  REVERB = "Reverb",
  PITCH = "Pitch",
  BIQUAD = "Biquad",
  BIQUAD_COMBO = "BiquadCombo",
}

export enum FILTER_TYPE_SHORT {
  GAIN = "GA",
  FLANGER = "FL",
  REVERB = "RE",
  PITCH = "PI",
  BIQUAD = "BQ",
  GRAPHIC_EQUALIZER = "EQ",
  BIQUAD_COMBO = "BC",
}

export enum FilterParameterType {
  GRAPHIC_EQUALIZER = "GraphicEqualizer",
}

export enum PROCESSOR_TYPE {
  COMPRESSOR = "Compressor",
  NOISE = "NoiseGate",
}

export enum PROCESSOR_TYPE_SHORT {
  COMPRESSOR = "CO",
  NOISE = "NO",
}

export enum STAGE_TYPE {
  FILTER = "Filter",
  PROCESSOR = "Processor",
  MIXER = "Mixer",
}

export interface DspConfig {
  title: string | null;
  description: string | null;
  devices: Devices;
  mixers: Record<string, Mixer>;
  filters: Record<string, Filter>;
  processors: Record<string, Processor>;
  pipeline: PipelineStage[];
}

export interface Devices {
  samplerate: number;
  chunksize: number;
  queuelimit: number | null;
  silence_threshold: number | null;
  silence_timeout: number | null;
  capture: CaptureDevice;
  playback: PlaybackDevice;
  enable_rate_adjust: boolean | null;
  target_level: number | null;
  adjust_period: number | null;
  resampler: unknown | null;
  capture_samplerate: number | null;
  stop_on_rate_change: boolean | null;
  rate_measure_interval: number | null;
  volume_ramp_time: number | null;
  volume_limit: number | null;
  multithreaded: boolean;
  worker_threads: number | null;
}

export type DeviceType = "Alsa" | "CoreAudio" | "Wasapi" | "Pulse" | "File" | "Stdin" | "Stdout";

export interface CaptureDevice {
  type: DeviceType;
  channels: number;
  device: string;
  format: string | null;
  stop_on_inactive: boolean | null;
  link_volume_control: string | null;
  link_mute_control: string | null;
  labels: string[] | null;
}

export interface PlaybackDevice {
  type: DeviceType;
  channels: number;
  device: string;
  format: string | null;
}

export interface Mixer {
  description: string | null;
  channels: {
    in: number;
    out: number;
  };
  mapping: MixerMapping[];
  labels: string[] | null;
}

export interface MixerMapping {
  dest: number;
  sources: MixerSource[];
  mute: boolean;
}

export interface MixerSource {
  channel: number;
  gain: number;
  inverted: boolean;
  mute: boolean;
  scale: "dB" | "linear";
}

export type Filter = BiquadFilter | BiquadComboFilter | GainFilter | ReverbFilter | PitchFilter | FlangerFilter;

export interface BiquadFilter {
  type: FILTER_TYPE.BIQUAD;
  description: string | null;
  parameters: BiquadParameters;
}

export type BiquadParameters =
  | { type: "Lowshelf"; freq: number; q: number; gain: number }
  | { type: "Highshelf"; freq: number; q: number; gain: number }
  | { type: "Peaking"; freq: number; q: number; gain: number }
  | { type: "Lowpass"; freq: number; q: number }
  | { type: "Highpass"; freq: number; q: number }
  | { type: "Notch"; freq: number; q: number }
  | { type: "Allpass"; freq: number; q: number };

export interface BiquadComboFilter {
  type: FILTER_TYPE.BIQUAD_COMBO;
  description: string | null;
  parameters: GraphicEqualizerParameters;
}

export interface GraphicEqualizerParameters {
  type: FilterParameterType.GRAPHIC_EQUALIZER;
  freq_min: number;
  freq_max: number;
  gains: number[];
}

export interface GainFilter {
  type: FILTER_TYPE.GAIN;
  description: string | null;
  parameters: {
    gain: number;
    inverted: boolean;
    mute: boolean;
    scale: "dB" | "linear";
  };
}

export interface ReverbFilter {
  type: FILTER_TYPE.REVERB;
  description: string | null;
  parameters: {
    reverberance: number;
    hf_damping: number;
    room_scale: number;
    stereo_depth: number;
    pre_delay_ms: number;
    wet_gain_db: number;
    wet: number;
  };
}

export interface PitchFilter {
  type: FILTER_TYPE.PITCH;
  description: string | null;
  parameters: {
    semitones: number;
    tempo: number;
    wet: number;
  };
}

export interface FlangerFilter {
  type: FILTER_TYPE.FLANGER;
  description: string | null;
  parameters: {
    delay_ms: number;
    depth_ms: number;
    regen: number;
    width: number;
    speed_hz: number;
    shape: "triangle" | "sine";
    phase_deg: number;
    wet: number;
  };
}

export type Processor = CompressorProcessor | NoiseGateProcessor;

export interface CompressorProcessor {
  type: PROCESSOR_TYPE.COMPRESSOR;
  description: string | null;
  parameters: {
    channels: number;
    monitor_channels: number[];
    process_channels: number[];
    attack: number;
    release: number;
    threshold: number;
    factor: number;
    makeup_gain: number;
    soft_clip: boolean;
    clip_limit: number | null;
  };
}

export interface NoiseGateProcessor {
  type: PROCESSOR_TYPE.NOISE;
  description: string | null;
  parameters: {
    channels: number;
    monitor_channels: number[];
    process_channels: number[];
    attack: number;
    release: number;
    threshold: number;
  };
}

export type PipelineStage = MixerStage | FilterStage | ProcessorStage;

export interface MixerStage {
  type: STAGE_TYPE.MIXER;
  name: string;
  description: string | null;
  bypassed: boolean;
}

export interface FilterStage {
  type: STAGE_TYPE.FILTER;
  channel: number;
  names: string[];
  description: string | null;
  bypassed: boolean;
}

export interface ProcessorStage {
  type: STAGE_TYPE.PROCESSOR;
  name: string;
  description: string | null;
  bypassed: boolean;
}
