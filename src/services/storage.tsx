import { useSocketRequest } from "@/store/useSocketRequest";

export const useStorageService = () => {
  const { request } = useSocketRequest();

  return {
    getDirectory:  (uri?: string, limit?: number, offset?:number) => request("storage.directory", {uri, limit, offset}),
    setMount: (dev: string) => request("storage.mount", {dev}),
    setUnMount: (dev: string) => request("storage.unmount", {dev}),
    setShare: (uri: string) => request("storage.share", {uri}),
    setUnshare: (uri: string) => request("storage.unshare", {uri}),
    addToLibrary: (uri: string) => request("storage.add_to_library", {uri}),
    removeFromLibrary: (uri: string) => request("storage.remove_from_library", {uri})
  }
};
