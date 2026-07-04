import { useSocketRequest } from "@/store/useSocketRequest";

export const useDisplayService = () => {
  const { request } = useSocketRequest();

  return {
    getDisplays: () => request("display.get_displays"),
  };
};
