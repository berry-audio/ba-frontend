import { useState } from "react";
import { useDispatch } from "react-redux";
import { INFO_EVENTS } from "@/store/constants";
import { useStorageService } from "@/services/storage";

export function useStorageActions() {
  const dispatch = useDispatch();

  const { getDirectory } = useStorageService();

  const [loading, setLoading] = useState<boolean>(false);

  const fetchStorages = async () => {
    setLoading(true);
    const response = await getDirectory();

    dispatch({
      type: INFO_EVENTS.STORAGE_UPDATED,
      payload: response,
    });
    setLoading(false);
  };

  return {
    fetchStorages,
    loading,
  };
}
