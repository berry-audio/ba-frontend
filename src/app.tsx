import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeProvider";
import { Provider } from "react-redux";
import { store } from "./store";
import { Toaster } from "sonner";

import Layout from "./layout";
import Spinner from "./components/Spinner";
import Collection from "./views/Collection";
// import Test from "./views/Test";

const Start = lazy(() => import("./views/Start"));
const BluetoothView = lazy(() => import("./views/Bluetooth"));
const Multiroom = lazy(() => import("./views/Multiroom"));
const Tracklist = lazy(() => import("./views/Tracklist"));
const Playlists = lazy(() => import("./views/Playlist/Playlists"));
const PlaylistView = lazy(() => import("./views/Playlist/PlaylistView"));
const Local = lazy(() => import("./views/Local/Local"));
const Radio = lazy(() => import("./views/Radio"));
const Tuner = lazy(() => import("./views/Tuner"));
const Storages = lazy(() => import("./views/Storage/Storages"));
const StorageDirectory = lazy(() => import("./views/Storage/StorageDirectory"));
const Dsp = lazy(() => import("./views/Dsp"));

const Settings = lazy(() => import("./views/Settings"));
const SettingsGeneral = lazy(() => import("./views/Settings/SettingsGeneral"));
const SettingsSystem = lazy(() => import("./views/Settings/SettingsSystem"));
const SettingsNetwork = lazy(() => import("./views/Settings/SettingsNetwork"));
const SettingsMixer = lazy(() => import("./views/Settings/SettingsMixer"));
const SettingsUsbdac = lazy(() => import("./views/Settings/SettingsUsbdac"));
const SettingsLocal = lazy(() => import("./views/Settings/SettingsLibrary"));
const SettingsStorage = lazy(() => import("./views/Settings/SettingsStorage"));
const SettingsLinein = lazy(() => import("./views/Settings/SettingsLinein"));
const SettingsDsp = lazy(() => import("./views/Settings/SettingsDsp"));
const SettingsTuner = lazy(() => import("./views/Settings/SettingsTuner"));
const SettingsDisplay = lazy(() => import("./views/Settings/SettingsDisplay"));
const SettingsMultiroom = lazy(() => import("./views/Settings/SettingsMultiroom"));
const SettingsSupport = lazy(() => import("./views/Settings/SettingsSupport"));

const PageLoader = () => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
    <Spinner />
  </div>
);

const App = () => {
  return (
    <ThemeProvider>
      <Provider store={store}>
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 3000,
            unstyled: true,
            classNames: {
              toast: "w-full",
            },
          }}
        />

        <Router>
          <Layout>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Start />} />
                <Route path="/bluetooth" element={<BluetoothView />} />
                <Route path="/spotify" element={<Start />} />
                <Route path="/usbdac" element={<Start />} />
                <Route path="/shairportsync" element={<Start />} />
                <Route path="/linein" element={<Start />} />
                <Route path="/multiroom" element={<Multiroom />} />
                <Route path="/tracklist" element={<Tracklist />} />
                <Route path="/playlist/" element={<Playlists />} />
                <Route path="/playlist/:id" element={<PlaylistView />} />
                <Route path="/local/" element={<Navigate to="/local/album" replace />} />
                <Route path="/local/:view?/" element={<Local />} />
                <Route path="/collection/" element={<Navigate to="/collection/recent" replace />} />
                <Route path="/collection/:view?/" element={<Collection />} />
                <Route path="/radio" element={<Radio />} />
                <Route path="/tuner" element={<Tuner />} />
                <Route path="/storage/" element={<Storages />} />
                <Route path="/storage/*" element={<StorageDirectory />} />
                <Route path="/dsp/" element={<Navigate to="/dsp/dashboard" replace />} />
                <Route path="/dsp/:view?/" element={<Dsp />} />
                <Route path="/config/" element={<Settings />} />
                <Route path="/config/system/" element={<SettingsSystem />} />
                <Route path="/config/general/" element={<SettingsGeneral />} />
                <Route path="/config/mixer/" element={<SettingsMixer />} />
                <Route path="/config/usbdac/" element={<SettingsUsbdac />} />
                <Route path="/config/local/" element={<SettingsLocal />} />
                <Route path="/config/network/" element={<SettingsNetwork />} />
                <Route path="/config/storage/" element={<SettingsStorage />} />
                <Route path="/config/linein/" element={<SettingsLinein />} />
                <Route path="/config/dsp/" element={<SettingsDsp />} />
                <Route path="/config/tuner/" element={<SettingsTuner />} />
                <Route path="/config/display/" element={<SettingsDisplay />} />
                <Route path="/config/multiroom/" element={<SettingsMultiroom />} />
                <Route path="/config/support/" element={<SettingsSupport />} />
              </Routes>
            </Suspense>
          </Layout>
        </Router>
      </Provider>
    </ThemeProvider>
  );
};

export default App;
