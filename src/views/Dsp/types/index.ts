export type BiquadParameters = {
    type: "Peaking" | "Lowshelf" | "Highshelf";
    freq: number;
    q?: number;
    slope?: number;
    gain: number;
};

export type GraphicEqualizerParameters = {
    type: "GraphicEqualizer";
    freq_min: number;
    freq_max: number;
    gains: number[];
};

export type GainParameters = {
    gain: number;
    inverted: boolean | null;
    mute: boolean | null;
    scale: string;
};

export type BiquadFilter = {
    type: "Biquad";
    description: string | null;
    parameters: BiquadParameters;
};

export type BiquadComboFilter = {
    type: "BiquadCombo";
    description: string | null;
    parameters: GraphicEqualizerParameters;
};

export type GainFilter = {
    type: "Gain";
    description: string | null;
    parameters: GainParameters;
};

export type FilterType =
    | BiquadFilter
    | BiquadComboFilter
    | GainFilter;

export type FiltersType = Record<string, FilterType>;



export enum FilterTypeNames {
  GAIN = 'Gain',
  FLANGER = 'Flanger',
  REVERB = 'Reverb',
  PITCH = 'Pitch',
  BIQUAD = 'Biquad',
  BIQUAD_COMBO = 'BiquadCombo',
}

export enum FilterTypeNameShort {
  GAIN = 'GA',
  FLANGER = 'FL',
  REVERB = 'RE',
  PITCH = 'PI',
  BIQUAD = 'BQ',
  GRAPHIC_EQUALIZER = 'EQ',
  BIQUAD_COMBO = 'BC',
}

export enum FilterParameterType {
  GRAPHIC_EQUALIZER = 'GraphicEqualizer',
}
