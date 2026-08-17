import { useSocketRequest } from "@/store/useSocketRequest";

export const useDspService = () => {
  const { request } = useSocketRequest();

  return {
    getDspConfig: () => request("dsp.get_config"),
    setDspConfig: (config: any) => request("dsp.set_config", { config }),
  };
};
