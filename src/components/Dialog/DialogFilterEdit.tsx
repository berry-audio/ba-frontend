import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useDspActions } from "@/hooks/useDspActions";
import { UseFormReturn } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { DIALOG_EVENTS } from "@/store/constants";

import Modal from "../Modal";
import Gain from "@/views/Dsp/components/Filters/Gain";
import Pitch from "@/views/Dsp/components/Filters/Pitch";
import Reverb from "@/views/Dsp/components/Filters/Reverb";
import Biquad from "@/views/Dsp/components/Filters/Biquad";
import Flanger from "@/views/Dsp/components/Filters/Flanger";
import BiquadCombo from "@/views/Dsp/components/Filters/BiquadCombo";

type DialogFilterEditType = {
  item: {
    name: string;
    filter: any;
  };
};

const DialogFilterEdit = ({ item }: DialogFilterEditType) => {
  const dispatch = useDispatch();

  const { saveFilter, loading } = useDspActions();

  const [autoUpdate, setAutoUpdate] = useState<boolean>(true);

  const filter = item.filter;
  const filterName = item.name;
  const filterType = item.filter.type;

  const formRef = useRef<UseFormReturn<any>>(null);
  const submitForm = (autoUpdate?: boolean) => formRef.current?.handleSubmit((values) => saveFilter(values, autoUpdate))();
  const handleOnRelease = () => autoUpdate && submitForm(autoUpdate);
  const handleSave = () => submitForm();

  const isGraphicEqualizer = filterType === "BiquadCombo" && item.filter.parameters.type === "GraphicEqualizer";

  return (
    <Modal
      title={filterName}
      onClose={() => dispatch({ type: DIALOG_EVENTS.DIALOG_CLOSE })}
      isOpen={true}
      buttonText="Apply"
      buttonOnClick={handleSave}
      buttonLoading={loading}
      size={isGraphicEqualizer ? "w-200" : "w-125"}
    >
      {filterType === "Gain" && <Gain ref={formRef} filter={{ name: filterName, ...filter }} onRelease={handleOnRelease} />}
      {filterType === "Pitch" && <Pitch ref={formRef} filter={{ name: filterName, ...filter }} onRelease={handleOnRelease} />}
      {filterType === "Reverb" && <Reverb ref={formRef} filter={{ name: filterName, ...filter }} onRelease={handleOnRelease} />}
      {filterType === "Biquad" && <Biquad ref={formRef} filter={{ name: filterName, ...filter }} onRelease={handleOnRelease} />}
      {filterType === "Flanger" && <Flanger ref={formRef} filter={{ name: filterName, ...filter }} onRelease={handleOnRelease} />}
      {filterType === "BiquadCombo" && <BiquadCombo ref={formRef} filter={{ name: filterName, ...filter }} onRelease={handleOnRelease} />}

      <div className="flex items-center mt-7">
        <Checkbox value={autoUpdate} onChange={setAutoUpdate} />
        <label className="cursor-pointer ml-2" onClick={() => setAutoUpdate(!autoUpdate)}>
          Apply automatically
        </label>
      </div>
    </Modal>
  );
};

export default DialogFilterEdit;
