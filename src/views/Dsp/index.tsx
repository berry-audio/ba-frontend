import { useNavigate, useParams } from "react-router-dom";
import { VinylRecordIcon } from "@phosphor-icons/react";
import { ICON_WEIGHT, ICON_XS } from "@/constants";

import Page from "@/components/Page";
import Tabs from "@/components/ui/tabs";
import Status from "./components/Status";
import VuMeter from "./components/VuMeter";
import Filters from "./components/Filters";
import Pipeline from "./components/Pipeline";
import ButtonDspRefresh from "@/components/Button/ButtonDspRefresh";

const Dsp = () => {
  const navigate = useNavigate();
  const { view = "dashboard" } = useParams<{ view: string }>();

  const directory = {
    dashboard: {
      title: "Dashboard",
      icon: <VinylRecordIcon weight={ICON_WEIGHT} size={ICON_XS} />,
    },
    filters: {
      title: "Filters",
      icon: <VinylRecordIcon weight={ICON_WEIGHT} size={ICON_XS} />,
    },
    pipeline: {
      title: "Pipeline",
      icon: <VinylRecordIcon weight={ICON_WEIGHT} size={ICON_XS} />,
    },
  } as const;

  const onTabChange = (tab: string) => {
    navigate(`/dsp/${tab}`);
  };

  return (
    <Page
      backButton
      title="DSP Manager"
      rightComponent={
        <div className="flex">
          <div className="mr-3">
            <ButtonDspRefresh />
          </div>
        </div>
      }
    >
      <div className="px-3 pb-3">
        <Tabs activeTab={view} onTabChange={onTabChange} items={directory} />
      </div>

      {view === "dashboard" && (
        <>
          <Status />
          <div className="py-3 px-5">
            <VuMeter />
          </div>
        </>
      )}

      {view === "filters" && <Filters />}
      {view === "pipeline" && <Pipeline />}
    </Page>
  );
};

export default Dsp;
