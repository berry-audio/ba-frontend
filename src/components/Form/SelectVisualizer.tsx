import SelectComboBox, { ComboboxItem } from "./SelectComboBox";

interface SelectVisualizerProps {
  value?: string | number | null;
  onChange: (value: string | number | null) => void;
  placeholder?: string;
}

const items: ComboboxItem[] = [
   {
    label: "Spectrum Analyser 1",
    value: 1,
  },
  {
    label: "Spectrum Analyser 2",
    value: 2,
  },
  {
    label: "Spectrum Analyser 3",
    value: 3,
  },
  {
    label: "Spectrum Analyser 4",
    value: 4,
  },
  {
    label: "VU Meter 1",
    value: 5,
  },
  {
    label: "VU Meter 2",
    value: 6,
  },
  {
    label: "Progress Bar",
    value: 7,
  },
];

function SelectVisualizer({ ...props }: SelectVisualizerProps) {
  return <SelectComboBox items={items} {...props} />;
}

export default SelectVisualizer;
