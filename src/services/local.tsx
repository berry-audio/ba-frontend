import { useSocketRequest } from "@/store/useSocketRequest";

export const useLocalService = () => {
  const { request } = useSocketRequest();

  return {
    getDirectory: (uri?: string, limit?: number, offset?:number) => request("local.directory", {uri, limit, offset}),
    getDirectoryOffsets: (uri?: string) => request("local.directory_offsets", { uri }),
    getScanProgress : () => request("local.scan_progress"),
    setScan: () => request("local.scan"),
    setScanArtists: () => request("local.scan_artists"),
    setClean: () => request("local.clean")
  }
};
