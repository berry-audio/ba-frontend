import { DIALOG_EVENTS } from "../constants";

interface DialogState {
  dialog: string | null;
  payload: any;
}

const initialDialogState: DialogState = {
  dialog: null,
  payload: null,
};

export const searchReducer = (state = initialDialogState, action: any): DialogState => {
  const { type, payload } = action;

  switch (type) {
    case DIALOG_EVENTS.DIALOG_SEARCH:
      return { dialog: type, payload };

    case DIALOG_EVENTS.DIALOG_SEARCH_CLOSE:
      return { dialog: null, payload: null };

    default:
      return state;
  }
};
