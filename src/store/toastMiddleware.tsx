import { ToastContent } from "@/components/Toast";
import { toast } from "sonner";
import { EVENTS } from "@/constants/events";
import { INFO_EVENTS } from "./constants";

export const toastMiddleware = () => (next: any) => (action: any) => {
  const result = next(action);
  const { payload } = action;

  switch (action.type) {
    case INFO_EVENTS.LIBRARY_SCAN_COMPLETED:
      toast.custom((id) => (
        <ToastContent
          id={id}
          title="Library Scan Completed"
          description={`Processed ${payload.processed} Inserted ${payload.inserted} Updated ${payload.updated}`}
          variant="info"
        />
      ));
      break;
    case INFO_EVENTS.ADD_TO_QUEUE:
      const isArray = Array.isArray(payload);
      const isEmpty = isArray && payload.length === 0;
      const title = isArray
        ? payload.length === 1
          ? `${payload[0].name} Added to Queue`
          : `${payload.length} Tracks Added to Queue`
        : `${payload.name} Added to Queue`;

      if (isEmpty) {
        toast.custom((id) => <ToastContent id={id} title="No Tracks to Add" variant="info" />);
      } else {
        toast.custom((id) => <ToastContent id={id} title={title} variant="success" />);
      }
      break;
    case INFO_EVENTS.CLEAR_QUEUE:
      toast.custom((id) => <ToastContent id={id} title="Queue Cleared" variant="info" />);
      break;
    case INFO_EVENTS.PLAYLIST_CREATED:
      toast.custom((id) => <ToastContent id={id} title={`Playlist ${payload.name} Created`} variant="success" />);
      break;
    case INFO_EVENTS.PLAYLIST_UPDATED:
      toast.custom((id) => <ToastContent id={id} title={`Playlist ${payload.name} Updated`} variant="success" />);
      break;
    case INFO_EVENTS.PLAYLIST_REMOVED:
      toast.custom((id) => <ToastContent id={id} title={`Playlist ${payload.name} Deleted`} variant="warning" />);
      break;
    case INFO_EVENTS.PLAYLIST_TRACK_ADDED:
      toast.custom((id) => (
        <ToastContent
          id={id}
          title={`${payload.tracks.length} ${payload.tracks.length > 1 ? "Tracks" : "Track"} Added to ${payload.name}`}
          variant="success"
        />
      ));
      break;
    case INFO_EVENTS.PLAYLIST_TRACK_REMOVED:
      toast.custom((id) => <ToastContent id={id} title={`${payload.track.name} Removed`} variant="warning" />);
      break;
    case INFO_EVENTS.STORAGE_ADD_TO_LIBRARY:
      toast.custom((id) => <ToastContent id={id} title={`${payload.name} Added to Library`} variant="success" />);
      break;
    case INFO_EVENTS.STORAGE_MOUNTED:
      toast.custom((id) => <ToastContent id={id} title={`Storage ${payload.name} Mounted`} variant="success" />);
      break;
    case INFO_EVENTS.STORAGE_UNMOUNTED:
      toast.custom((id) => <ToastContent id={id} title={`Storage ${payload.name} Unmounted`} variant="warning" />);
      break;
    case INFO_EVENTS.STORAGE_SHARED:
      toast.custom((id) => <ToastContent id={id} title={`Folder ${payload.name} Shared`} variant="success" />);
      break;
    case INFO_EVENTS.STORAGE_UNSHARED:
      toast.custom((id) => <ToastContent id={id} title={`Folder ${payload.name} Unshared`} variant="warning" />);
      break;
    case INFO_EVENTS.SNAPCAST_SCAN_COMPLETED:
      toast.custom((id) => <ToastContent id={id} title="Multiroom Scan Completed" variant="success" />);
      break;
    case INFO_EVENTS.WLAN_SCAN_COMPLETED:
      toast.custom((id) => <ToastContent id={id} title="Wifi Scan Completed" variant="success" />);
      break;
    case INFO_EVENTS.BLUETOOTH_SCAN_COMPLETED:
      toast.custom((id) => <ToastContent id={id} title="Bluetooth Scan Completed" variant="success" />);
      break;
    case EVENTS.MIXER_MUTE:
      toast.custom((id) => <ToastContent id={id} title={`Mixer ${payload.mute ? "Muted" : "Unmuted"}`} variant="info" />);
      break;
    case EVENTS.SOURCE_CHANGED:
      if (payload.source.name) toast.custom((id) => <ToastContent id={id} title={`Source Changed to ${payload.source.name}`} variant="info" />);
      break;
    case EVENTS.CONFIG_UPDATED:
      toast.custom((id) => <ToastContent id={id} title="Settings Updated" variant="success" />);
      break;
    case EVENTS.TRACK_PLAYBACK_ERROR:
      toast.custom((id) => <ToastContent id={id} title="Playback Error" variant="error" />);
      break;
    case EVENTS.BLUETOOTH_DISCOVERABLE:
      toast.custom((id) => (
        <ToastContent
          id={id}
          title={`Bluetooth ${payload.state ? "Discoverable On" : "Discoverable Off"}`}
          variant={`${payload.state ? "success" : "info"}`}
        />
      ));
      break;
    case EVENTS.BLUETOOTH_POWERED:
      toast.custom((id) => (
        <ToastContent id={id} title={`Bluetooth ${payload.state ? "Power On" : "Power Off"}`} variant={`${payload.state ? "success" : "info"}`} />
      ));
      break;
    case EVENTS.BLUETOOTH_CONNECTED:
      toast.custom((id) => <ToastContent id={id} title={`Bluetooth ${payload.device.name} Connected`} variant="success" />);
      break;
    case EVENTS.BLUETOOTH_DISCONNECTED:
      toast.custom((id) => <ToastContent id={id} title={`Bluetooth ${payload.device.name} Disconnected`} variant="warning" />);
      break;
  }

  if (action.toast) {
    const { title, description, variant = "info" } = action.toast;
    toast.custom((id) => <ToastContent id={id} title={title} description={description} variant={variant} />);
  }

  return result;
};
