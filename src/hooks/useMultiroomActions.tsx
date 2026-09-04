import { useState } from "react";
import { useDispatch } from "react-redux";
import { useMultiroomService } from "@/services/multiroom";
import { DIALOG_EVENTS, INTERNAL_EVENTS } from "@/store/constants";

export function useMultiroomActions() {
  const dispatch = useDispatch();
  const { getServers } = useMultiroomService();

  const [loading, setLoading] = useState<boolean>(false);

  const fetchServers = async () => {
    setLoading(true);
    const response = await getServers();

    dispatch({
      type: INTERNAL_EVENTS.MULTIROOM_SCAN_COMPLETED,
      payload: response,
    });

    setLoading(false);
  };

  const showServerInfo = () => {
    dispatch({ type: DIALOG_EVENTS.DIALOG_MULTIROOM_INFO });
  };

  return {
    fetchServers,
    showServerInfo,
    loading,
  };
}
