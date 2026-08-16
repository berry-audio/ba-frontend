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