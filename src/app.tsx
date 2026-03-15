import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeProvider";
import { Provider } from "react-redux";
import { store } from "./store";

import Local from "./views/Local";
import Storage from "./views/Storage";
import Start from "./views/Start";
import Layout from "./layout";
import Queue from "./views/Queue";
import Settings from "./views/Settings";
import Radio from "./views/Radio";
import Playlists from "./views/Playlist";
import SettingsGeneral from "./views/Settings/SettingsGeneral";
import SettingsNetwork from "./views/Settings/SettingsNetwork";
import SettingsCamillaDsp from "./views/Settings/SettingsCamillaDsp";
import Snapcast from "./views/Snapcast";
import SettingsSnapcast from "./views/Settings/SettingsSnapcast";
import Bluetooth from "./views/Bluetooth";
import SettingsLocal from "./views/Settings/SettingsLibrary";
import SettingsDisplay from "./views/Settings/SettingsDisplay";
import SettingsSharing from "./views/Settings/SettingsSharing";
import SettingsSupport from "./views/Settings/SettingsSupport";
import SettingsSystem from "./views/Settings/SettingsSystem";

const App = () => {
  return (
    <ThemeProvider>
      <Provider store={store}>
        <Router>
          <Layout>
            <Routes key={location.pathname}>
              <Route path="/" element={<Start />} />
              <Route path="/bluetooth" element={<Bluetooth />} />
              <Route path="/spotify" element={<Start />} />
              <Route path="/shairportsync" element={<Start />} />
              <Route path="/multiroom" element={<Snapcast />} />
              <Route path="/queue" element={<Queue />} />
              <Route path="/playlist/:id?" element={<Playlists />} />
              <Route path="/local/:view?/:id?" element={<Local />} />
              <Route path="/radio" element={<Radio />} />
              <Route path="/storage/*" element={<Storage />} />
              <Route path="/settings/" element={<Settings />} />
              <Route path="/settings/system/" element={<SettingsSystem />} />
              <Route path="/settings/general/" element={<SettingsGeneral />} />
              <Route path="/settings/local/" element={<SettingsLocal />} />
              <Route path="/settings/bluetooth/" element={<Bluetooth />} />
              <Route path="/settings/network/" element={<SettingsNetwork />} />
              <Route path="/settings/sharing/" element={<SettingsSharing />} />
              <Route path="/settings/dsp/" element={<SettingsCamillaDsp />} />
              <Route path="/settings/display/" element={<SettingsDisplay />} />
              <Route path="/settings/multiroom/" element={<SettingsSnapcast />} />
              <Route path="/settings/support/" element={<SettingsSupport />} />
            </Routes>
          </Layout>
        </Router>
      </Provider>
    </ThemeProvider>
  );
};

export default App;
