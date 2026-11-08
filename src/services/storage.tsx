import { useSocketRequest } from "@/store/useSocketRequest";

export const useStorageService = () => {
  const { request } = useSocketRequest();

  return {
    // v5 backend only returns the storage device list when uri == "storage"
    // exactly (v4 accepted a missing uri); undefined keys are dropped in
    // JSON so a bare call must send the explicit root uri.
    getDirectory:  (uri?: string, limit?: number, offset?:number) => request("storage.directory", {uri: uri ?? "storage", limit, offset}),
    setMount: (dev: string) => request("storage.mount", {dev}),
    setUnMount: (dev: string) => request("storage.unmount", {dev}),
    setShare: (uri: string) => request("storage.share", {uri}),
    setUnshare: (uri: string) => request("storage.unshare", {uri}),
    addToLibrary: (uri: string) => request("storage.add_to_library", {uri}),
    setMountShared: (devs: string[]) => request("storage.mount_shared", {devs}),
    setUnMountShared: (dev: string) => request("storage.unmount_shared", {dev}),
    removeFromLibrary: (uri: string) => request("storage.remove_from_library", {uri}),
    addShared: (ip: string, username: string, password: string) => request("storage.add_shared", {ip, username, password}),
  }
};
