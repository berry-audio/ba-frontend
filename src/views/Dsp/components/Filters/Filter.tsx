import { DIALOG_EVENTS } from "@/store/constants";
import { FilterParameterType, FILTER_TYPE, FILTER_TYPE_SHORT } from "../../types";
import { useDispatch } from "react-redux";
import ItemPadding from "@/components/Wrapper/ItemPadding";

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
  if (!name) return;

  const dispatch = useDispatch();

  return (
    <ItemPadding>
      <div
        className="flex items-center w-full cursor-pointer justify-between relative group"
        onClick={() => (onClick ? onClick(name) : dispatch({ type: DIALOG_EVENTS.DIALOG_DSP_FILTER_EDIT, payload: { name, filter } }))}
      >
        <div className="flex items-center">
          <div className="bg-cover text-primary rounded-md w-12 h-12 flex items-center justify-center text-xl mr-3">{getFilterAlphabet(filter)}</div>
          <div>
            {name}
            <div className="text-secondary text-md">{filter.type}</div>
          </div>
        </div>
      </div>
    </ItemPadding>
  );
};

export default Filter;
