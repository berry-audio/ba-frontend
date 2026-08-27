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
