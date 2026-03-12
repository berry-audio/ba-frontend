import { useState } from "react";
import { useDispatch } from "react-redux";
import { INFO_EVENTS } from "@/store/constants";
import { useStorageService } from "@/services/storage";

export function useStorageActions() {
  const dispatch = useDispatch();

  const { getDirectory, addShared, setMountShared } = useStorageService();

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

  const connectStorage = async (ip: string, username: string = "", password: string = "") => {
    setLoading(true);
    const response = await addShared(ip, username, password);
    setLoading(false);
    return response;
  };

  const mountSharedStorage = async (devs: string[]) => {
    setLoading(true);
    const response = await setMountShared(devs);
    setLoading(false);
    return response;
  };

  return {
    fetchStorages,
    connectStorage,
    mountSharedStorage,
    loading,
  };
}
