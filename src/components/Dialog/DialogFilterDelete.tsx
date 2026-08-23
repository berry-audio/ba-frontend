import { useDispatch } from "react-redux";
import { DIALOG_EVENTS } from "@/store/constants";

import Modal from "../Modal";
import useDspActions from "@/hooks/useDspActions";

type DialogStageType = {
  item: {
    name: string;
  };
};

const DialogFilterDelete = ({ item }: DialogStageType) => {
  const dispatch = useDispatch();

  const { deleteFilter, loading } = useDspActions();

  return (
    <Modal
      title={`Delete filter`}
      onClose={() => dispatch({ type: DIALOG_EVENTS.DIALOG_CLOSE })}
      isOpen={true}
      buttonText="Delete"
      buttonLoading={loading}
      buttonOnClick={() => deleteFilter(item.name)}
    >
      <span className="text-secondary">
        Are you sure you want to delete filter <b>{item.name}</b>? <br></br>This will also remove the filter from the pipeline.
      </span>
    </Modal>
  );
};

export default DialogFilterDelete;
