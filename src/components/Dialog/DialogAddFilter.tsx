import { UseFormReturn } from "react-hook-form";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { FilterTypeNames } from "@/views/Dsp/types";
import { DIALOG_EVENTS } from "@/store/constants";

import Gain, { defaultGainValues } from "@/views/Dsp/components/Filters/Gain";
import Pitch, { defaultPitchValues } from "@/views/Dsp/components/Filters/Pitch";
import Reverb, { defaultReverbValues } from "@/views/Dsp/components/Filters/Reverb";
import Biquad, { defaultBiquadValues } from "@/views/Dsp/components/Filters/Biquad";
import Flanger, { defaultFlangerValues } from "@/views/Dsp/components/Filters/Flanger";
import BiquadCombo, { defaultBiquadComboValues } from "@/views/Dsp/components/Filters/BiquadCombo";

import Modal from "@/components/Modal";
import useDspActions from "@/hooks/useDspActions";
import SelectComboBox from "../Form/SelectComboBox";

export const OPTIONS_TYPE = [
  { value: FilterTypeNames.GAIN, label: FilterTypeNames.GAIN },
  { value: FilterTypeNames.PITCH, label: FilterTypeNames.PITCH },
  { value: FilterTypeNames.REVERB, label: FilterTypeNames.REVERB },
  { value: FilterTypeNames.BIQUAD, label: FilterTypeNames.BIQUAD },
  { value: FilterTypeNames.FLANGER, label: FilterTypeNames.FLANGER },
  { value: FilterTypeNames.BIQUAD_COMBO, label: FilterTypeNames.BIQUAD_COMBO },
];

const DialogAddFilter = () => {
  const dispatch = useDispatch();

  const { saveFilter, loading } = useDspActions();

  const [selectedType, setSelectedType] = useState<FilterTypeNames>(FilterTypeNames.GAIN);

  const formRef = useRef<UseFormReturn<any>>(null);
  const handleSave = () =>  formRef.current?.handleSubmit((values) => saveFilter(values))();

  const defaultValues = {
    [FilterTypeNames.GAIN]: defaultGainValues,
    [FilterTypeNames.PITCH]: defaultPitchValues,
    [FilterTypeNames.REVERB]: defaultReverbValues,
    [FilterTypeNames.BIQUAD]: defaultBiquadValues,
    [FilterTypeNames.FLANGER]: defaultFlangerValues,
    [FilterTypeNames.BIQUAD_COMBO]: defaultBiquadComboValues,
  };

  const selectedFilter: any = defaultValues[selectedType];

  return (
    <Modal
      title="Add Filter"
      onClose={() => dispatch({ type: DIALOG_EVENTS.DIALOG_CLOSE })}
      isOpen={true}
      buttonText="Save"
      buttonLoading={loading}
      buttonOnClick={handleSave}
    >
      <div className="mb-5">
        <div className="mb-2">Filter Type</div>
        <SelectComboBox items={OPTIONS_TYPE} value={selectedType} onChange={(value) => setSelectedType(value)} />
      </div>

      {selectedType === FilterTypeNames.GAIN && <Gain ref={formRef} filter={selectedFilter} />}
      {selectedType === FilterTypeNames.PITCH && <Pitch ref={formRef} filter={selectedFilter} />}
      {selectedType === FilterTypeNames.REVERB && <Reverb ref={formRef} filter={selectedFilter} />}
      {selectedType === FilterTypeNames.BIQUAD && <Biquad ref={formRef} filter={selectedFilter} />}
      {selectedType === FilterTypeNames.FLANGER && <Flanger ref={formRef} filter={selectedFilter} />}
      {selectedType === FilterTypeNames.BIQUAD_COMBO && <BiquadCombo ref={formRef} filter={selectedFilter} />}
    </Modal>
  );
};

export default DialogAddFilter;
