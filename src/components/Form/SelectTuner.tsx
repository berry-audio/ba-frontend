import { useEffect, useState } from "react";
import { useTunerService } from "@/services/tuner";
import { TunerDevice } from "@/types";

import SelectComboBox from "./SelectComboBox";
interface SelectTunerDevicesProps {
  value?: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  device?: string;
}

function SelectTuner(props: SelectTunerDevicesProps) {
  const { getTuners } = useTunerService();
  const [devices, setDevices] = useState<TunerDevice[]>([]);

  useEffect(() => {
    const fetchDevices = async () => {
      const response = await getTuners();
      setDevices(response);
    };
    fetchDevices();
  }, [props.device]);

  const onChangeHandler = (value: string) => {
    props.onChange(value);
  };

  const items = devices.map((device) => ({
    label: device.name,
    value: device.device,
    description: device.description,
  }));

  const hasCurrentValue = devices.some((device) => device.device === props.value);
  const safeValue = hasCurrentValue ? props.value : null;
  return <SelectComboBox items={items} {...props} value={safeValue} onChange={onChangeHandler} />;
}

export default SelectTuner;
