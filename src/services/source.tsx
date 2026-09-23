import { useSocketRequest } from "@/store/useSocketRequest";

export const useSourceService = () => {
  const { request } = useSocketRequest();

  return {
    getSource: () => request("source.get"),
    getSourceDirectory: () => request("source.directory"),
    setSource: (uri: string) => request("source.set", { uri }),
  };
};
