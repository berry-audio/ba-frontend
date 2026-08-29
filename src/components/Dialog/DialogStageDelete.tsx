import { useDispatch } from "react-redux";
import { useDspActions } from "@/hooks/useDspActions";
import { DIALOG_EVENTS } from "@/store/constants";

import Modal from "../Modal";

type DialogStageType = {
  item: {
    index: number;
    type: string;
  };
};

const DialogStageDelete = ({ item }: DialogStageType) => {
  const dispatch = useDispatch();

  const { deleteStage, loading } = useDspActions();

  return (
    <Modal
      title={`Delete Stage`}
      onClose={() => dispatch({ type: DIALOG_EVENTS.DIALOG_CLOSE })}
      isOpen={true}
      buttonText="Delete"
      buttonLoading={loading}
      buttonOnClick={() => deleteStage(item.index)}
    >
      <span className="text-secondary">
        Are you sure you want to delete this stage with type <b>{item.type}</b>?
      </span>
    </Modal>
  );
};

export default DialogStageDelete;
