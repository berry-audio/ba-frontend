import { useState } from "react";
import { REF } from "@/constants/refs";
import { useLocalService } from "@/services/local";
import { usePlaylistService } from "@/services/playlist";
import { useTracklistService } from "@/services/tracklist";
import { Item, TlTrack, Track } from "@/types";

export function useAddToQueue() {
  const { add } = useTracklistService();
  const { getDirectory } = useLocalService();
  const { getPlaylistItem } = usePlaylistService();

  const [loading, setLoading] = useState<boolean>(false);

  const handleAddToQueue = async (item: Item) => {
    const tracksUris: string[] = [];
    setLoading(true);
    switch (item.type) {
      case REF.CATEGORY:
      case REF.ARTIST:
      case REF.ALBUM:
      case REF.GENRE: {
        const tracks = await getDirectory(`${item.uri}:list`);
        if (tracks?.length) {
          tracksUris.push(...tracks.map((track: Track) => track.uri));
        }
        break;
      }
      case REF.PLAYLIST: {
        const playlist = await getPlaylistItem(item.uri);
        if (playlist?.tracks?.length) {
          tracksUris.push(
            ...playlist.tracks.map((track: TlTrack) => track.track.uri)
          );
        }
        break;
      }
      default:
        tracksUris.push(item.uri);
        break;
    }
    await add(tracksUris);
    setLoading(false);
  };

return { handleAddToQueue, loading };
}