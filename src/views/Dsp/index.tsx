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
      title="Digital Signal Processor"
      rightComponent={
        <div className="flex">
          <div className="mr-4">
            <ButtonDspRefresh />
          </div>
        </div>
      }
    >
      <div className="py-4 md:px-4">
        <div className="mb-8">
          <Tabs activeTab={view} onTabChange={onTabChange} items={directory} />
        </div>

        {view === "dashboard" && (
          <>
            <div className="pb-8">
              <Status />
            </div>

            <div className="pb-8">
              <VuMeter />
            </div>
          </>
        )}

        {view === "filters" && (
          <div className="pb-8">
            <Filters />
          </div>
        )}

        {view === "pipeline" && (
          <div className="pb-8">
            <Pipeline />
          </div>
        )}
      </div>
    </Page>
  );
};

export default Dsp;
