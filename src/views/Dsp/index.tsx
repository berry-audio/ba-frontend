import Page from "@/components/Page";
import VuMeter from "./components/VuMeter";
import Status from "./components/Status";
import { useState } from "react";
import { VinylRecordIcon } from "@phosphor-icons/react";
import { ICON_WEIGHT, ICON_XS } from "@/constants";
import Tabs from "@/components/ui/tabs";
import Filters from "./components/Filters";
import { useNavigate, useParams } from "react-router-dom";
import Pipeline from "./components/Pipeline";

const Dsp = () => {
  const navigate = useNavigate();

  const { view } = useParams<{ view: string }>();

  const [activeTab, setActiveTab] = useState<string>(view ?? "dashboard");

  const directory = {
    ["dashboard"]: {
      title: "Dashboard",
      icon: <VinylRecordIcon weight={ICON_WEIGHT} size={ICON_XS} />,
    },

    ["filters"]: {
      title: "Filters",
      icon: <VinylRecordIcon weight={ICON_WEIGHT} size={ICON_XS} />,
    },
    ["pipeline"]: {
      title: "Pipeline",
      icon: <VinylRecordIcon weight={ICON_WEIGHT} size={ICON_XS} />,
    },
  } as const;

  const onTabChange = (tab: any) => {
    setActiveTab(tab);
    navigate(`/dsp/${tab}`);
  };

  return (
    <Page backButton title="DSP">
      <div className="px-4 py-4">
        <div className="mb-8">
          <Tabs activeTab={activeTab} onTabChange={onTabChange} items={directory} />
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
