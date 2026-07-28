import { combineReducers } from "redux";
import { socketReducer } from "./socketReducer";
import { dialogReducer } from "./dialogReducer";
import { eventReducer } from "./eventReducer";
import { playerReducer } from "./playerReducer";
import { systemReducer } from "./systemReducer";
import { overlayReducer } from "./overlayReducer";
import { bluetoothReducer } from "./bluetoothReducer";
import { scanReducer } from "./scanReducer";
import { networkReducer } from "./networkReducer";
import { tracklistReducer } from "./tracklistReducer";
import { configReducer } from "./configReducer";
import { multiroomReducer } from "./multiroomReducer";
import { drawerReducer } from "./drawerReducer";
import { tunerReducer } from "./tuner";

export const rootReducer = combineReducers({
  socket: socketReducer,
  event: eventReducer,
  dialog: dialogReducer,
  overlay: overlayReducer,
  drawer: drawerReducer,
  player: playerReducer,
  system: systemReducer,
  scan: scanReducer,
  bluetooth: bluetoothReducer,
  multiroom: multiroomReducer,
  network: networkReducer,
  tracklist: tracklistReducer,
  tuner: tunerReducer,
  config: configReducer,
});
