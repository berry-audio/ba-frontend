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

export enum STAGE_TYPE {
  FILTER = "Filter",
  PROCESSOR = "Processor",
  MIXER = "Mixer",
}
