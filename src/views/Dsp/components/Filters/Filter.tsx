import { useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { FilterParameterType, FILTER_TYPE, FILTER_TYPE_SHORT } from "../../types";

import Gain from "./Gain";
import Modal from "@/components/Modal";
import Pitch from "./Pitch";
import Reverb from "./Reverb";
import Flanger from "./Flanger";
import Biquad from "./Biquad";
import BiquadCombo from "./BiquadCombo";
import useDspActions from "@/hooks/useDspActions";

export interface FilterProps {
  name: string;
  filter: any;
  onClick?: (name: string) => void;
}

const getFilterAlphabet = (filter: any) => {
  switch (filter.type) {
    case FILTER_TYPE.GAIN:
      return FILTER_TYPE_SHORT.GAIN;

    case FILTER_TYPE.FLANGER:
      return FILTER_TYPE_SHORT.FLANGER;

    case FILTER_TYPE.REVERB:
      return FILTER_TYPE_SHORT.REVERB;

    case FILTER_TYPE.PITCH:
      return FILTER_TYPE_SHORT.PITCH;

    case FILTER_TYPE.BIQUAD:
      return FILTER_TYPE_SHORT.BIQUAD;

    case FILTER_TYPE.BIQUAD_COMBO:
      return filter.parameters?.type === FilterParameterType.GRAPHIC_EQUALIZER ? FILTER_TYPE_SHORT.GRAPHIC_EQUALIZER : FILTER_TYPE_SHORT.BIQUAD_COMBO;

    default:
      return "";
  }
};

export const Filter = ({ name, filter, onClick }: FilterProps) => {
  const { saveFilter, loading } = useDspActions();

  const [editDialog, setEditDialog] = useState<boolean>(false);
  const [autoUpdate, setAutoUpdate] = useState<boolean>(false);

  const isGraphicEqualizer = filter.type === "BiquadCombo" && filter.parameters.type === "GraphicEqualizer";

  const formRef = useRef<UseFormReturn<any>>(null);
  const submitForm = (autoUpdate?: boolean) => formRef.current?.handleSubmit((values) => saveFilter(values, autoUpdate))();
  const handleOnRelease = () => autoUpdate && submitForm(autoUpdate);
  const handleSave = () => submitForm();

  return (
    <>
      <div
        className="flex items-center w-full cursor-pointer justify-between relative group py-3 px-4 "
        onClick={() => (onClick ? onClick(name) : setEditDialog(true))}
      >
        <div className="flex items-center">
          <div className="bg-cover text-primary rounded-md w-12 h-12 flex items-center justify-center text-xl mr-3">{getFilterAlphabet(filter)}</div>
          <div>
            {name}
            <div className="text-secondary text-md">{filter.type}</div>
          </div>
        </div>
      </div>

      <Modal
        title={name}
        onClose={() => setEditDialog(false)}
        isOpen={editDialog}
        buttonText="Apply"
        buttonOnClick={handleSave}
        buttonLoading={loading}
        size={isGraphicEqualizer ? "w-200" : "w-125"}
      >
        {filter.type === "Gain" && <Gain ref={formRef} filter={{ name, ...filter }} onRelease={handleOnRelease} />}
        {filter.type === "Pitch" && <Pitch ref={formRef} filter={{ name, ...filter }} onRelease={handleOnRelease} />}
        {filter.type === "Reverb" && <Reverb ref={formRef} filter={{ name, ...filter }} onRelease={handleOnRelease} />}
        {filter.type === "Biquad" && <Biquad ref={formRef} filter={{ name, ...filter }} onRelease={handleOnRelease} />}
        {filter.type === "Flanger" && <Flanger ref={formRef} filter={{ name, ...filter }} onRelease={handleOnRelease} />}
        {filter.type === "BiquadCombo" && <BiquadCombo ref={formRef} filter={{ name, ...filter }} onRelease={handleOnRelease} />}

        <div className="flex items-center mt-7">
          <Checkbox value={autoUpdate} onChange={setAutoUpdate} />
          <label className="cursor-pointer ml-2" onClick={() => setAutoUpdate(!autoUpdate)}>
            Apply automatically
          </label>
        </div>
      </Modal>
    </>
  );
};

export default Filter;
