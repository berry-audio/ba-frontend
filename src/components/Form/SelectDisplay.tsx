import { useEffect, useState } from "react";
import { PcmDevice } from "@/types";
import { useDisplayService } from "@/services/display";

import SelectComboBox from "./SelectComboBox";

interface SelectDisplayDevicesProps {
  value?: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
}

function SelectDisplayDevices({ ...props }: SelectDisplayDevicesProps) {
  const { getDisplays } = useDisplayService();
  const [displayDevices, setDisplayDevices] = useState<PcmDevice[]>([]);

  useEffect(() => {
    const fetchDevices = async () => {
      const response = await getDisplays();

      setDisplayDevices(response);
    };
    fetchDevices();
  }, []);

  const items = displayDevices?.map((device) => ({
    label: device.name,
    value: device.device,
    description: device.description,
  }));

  const hasCurrentValue = displayDevices?.some((device: PcmDevice) => device.device === props.value);

  if (!hasCurrentValue) {
    props.value = null;
  }

  return <SelectComboBox items={items} {...props} />;
}

export default SelectDisplayDevices;
