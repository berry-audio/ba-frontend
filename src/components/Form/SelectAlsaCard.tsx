import { useEffect, useState } from "react";
import { useMixerService } from "@/services/mixer";
import { AlsaCard } from "@/types";

import SelectComboBox from "./SelectComboBox";

interface SelectAlsaCardInterface {
  value?: number | null;
  onChange: (value: number | null) => void;
  onSelectedCard?: (device: AlsaCard) => void;
  placeholder?: string;
}

function SelectAlsaCard({ ...props }: SelectAlsaCardInterface) {
  const { getCardList } = useMixerService();
  const [pcmDevices, setPcmDevices] = useState<AlsaCard[]>([]);

  useEffect(() => {
    const fetchCardList = async () => {
      const response = await getCardList();
      setPcmDevices(response);
    };
    fetchCardList();
  }, []);

  const onChangeHandler = (value: number) => {
    const device = pcmDevices.find((d: AlsaCard) => d.id === value);
    props.onSelectedCard?.(device as AlsaCard);
    props.onChange(value);
  };

  const items = pcmDevices?.map((device: AlsaCard) => ({
    label: device.name,
    value: device.id,
    description: device.device,
  }));

  const hasCurrentValue = pcmDevices?.some((device: AlsaCard) => device.id === props.value);

  if (!hasCurrentValue) {
    props.value = null;
  }

  return <SelectComboBox items={items} {...props} onChange={onChangeHandler} />;
}

export default SelectAlsaCard;
