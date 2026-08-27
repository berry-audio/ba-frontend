import { UseFormReturn } from "react-hook-form";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useDspActions } from "@/hooks/useDspActions";
import { FILTER_TYPE } from "@/views/Dsp/types";
import { DIALOG_EVENTS } from "@/store/constants";

import Gain, { defaultGainValues } from "@/views/Dsp/components/Filters/Gain";
import Pitch, { defaultPitchValues } from "@/views/Dsp/components/Filters/Pitch";
import Reverb, { defaultReverbValues } from "@/views/Dsp/components/Filters/Reverb";
import Biquad, { defaultBiquadValues } from "@/views/Dsp/components/Filters/Biquad";
import Flanger, { defaultFlangerValues } from "@/views/Dsp/components/Filters/Flanger";
import BiquadCombo, { defaultBiquadComboValues } from "@/views/Dsp/components/Filters/BiquadCombo";

import Modal from "@/components/Modal";
import SelectComboBox from "../Form/SelectComboBox";

export const OPTIONS_TYPE = [
  { value: FILTER_TYPE.GAIN, label: FILTER_TYPE.GAIN },
  { value: FILTER_TYPE.PITCH, label: FILTER_TYPE.PITCH },
  { value: FILTER_TYPE.REVERB, label: FILTER_TYPE.REVERB },
  { value: FILTER_TYPE.BIQUAD, label: FILTER_TYPE.BIQUAD },
  { value: FILTER_TYPE.FLANGER, label: FILTER_TYPE.FLANGER },
  { value: FILTER_TYPE.BIQUAD_COMBO, label: FILTER_TYPE.BIQUAD_COMBO },
];

const DialogFilterAdd = () => {
  const dispatch = useDispatch();

  const { saveFilter, loading } = useDspActions();

  const [selectedType, setSelectedType] = useState<FILTER_TYPE>(FILTER_TYPE.GAIN);

  const formRef = useRef<UseFormReturn<any>>(null);
  const handleSave = () => formRef.current?.handleSubmit((values) => saveFilter(values))();

  const defaultValues = {
    [FILTER_TYPE.GAIN]: defaultGainValues,
    [FILTER_TYPE.PITCH]: defaultPitchValues,
    [FILTER_TYPE.REVERB]: defaultReverbValues,
    [FILTER_TYPE.BIQUAD]: defaultBiquadValues,
    [FILTER_TYPE.FLANGER]: defaultFlangerValues,
    [FILTER_TYPE.BIQUAD_COMBO]: defaultBiquadComboValues,
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

      {selectedType === FILTER_TYPE.GAIN && <Gain ref={formRef} filter={selectedFilter} />}
      {selectedType === FILTER_TYPE.PITCH && <Pitch ref={formRef} filter={selectedFilter} />}
      {selectedType === FILTER_TYPE.REVERB && <Reverb ref={formRef} filter={selectedFilter} />}
      {selectedType === FILTER_TYPE.BIQUAD && <Biquad ref={formRef} filter={selectedFilter} />}
      {selectedType === FILTER_TYPE.FLANGER && <Flanger ref={formRef} filter={selectedFilter} />}
      {selectedType === FILTER_TYPE.BIQUAD_COMBO && <BiquadCombo ref={formRef} filter={selectedFilter} />}
    </Modal>
  );
};

export default DialogFilterAdd;
