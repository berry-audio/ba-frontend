import { useSocketRequest } from "@/store/useSocketRequest";

export const useMultiroomService = () => {
  const { request } = useSocketRequest();

  return {
    getServers: () => request("multiroom.servers"),
    getStatus: (ip: string) => request("multiroom.get_status", { ip }),
    setVolume: (ip: string, client_id: string, volume: number, mute?: boolean) => request("multiroom.set_volume", { ip, client_id, volume, mute }),
    connect: (ip: string) => request("multiroom.connect", { ip }),
    disconnect: () => request("multiroom.disconnect"),
  };
};
