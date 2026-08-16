import Page from "@/components/Page";
import VuMeter from "./components/VuMeter";
import Status from "./components/Status";
import { useState } from "react";
import { VinylRecordIcon } from "@phosphor-icons/react";
import { ICON_WEIGHT, ICON_XS } from "@/constants";
import Tabs from "@/components/ui/tabs";
import Filters from "./components/Filters";

const Dsp = () => {
  const [activeTab, setActiveTab] = useState<any>("DASHBOARD");

  const directory = {
    ["DASHBOARD"]: {
      title: "Dashboard",
      icon: <VinylRecordIcon weight={ICON_WEIGHT} size={ICON_XS} />,
    },
    ["MIXERS"]: {
      title: "Mixers",
      icon: <VinylRecordIcon weight={ICON_WEIGHT} size={ICON_XS} />,
    },
    ["PROCESSORS"]: {
      title: "Processors",
      icon: <VinylRecordIcon weight={ICON_WEIGHT} size={ICON_XS} />,
    },
    ["FILTERS"]: {
      title: "Filters",
      icon: <VinylRecordIcon weight={ICON_WEIGHT} size={ICON_XS} />,
    },
    ["PIPELINE"]: {
      title: "Pipeline",
      icon: <VinylRecordIcon weight={ICON_WEIGHT} size={ICON_XS} />,
    },
  } as const;

  const onTabChange = (tab: any) => {
    setActiveTab(tab);
    // navigate(`/local/${tab}`);
  };

  return (
    <Page backButton title="Camilla DSP">
      <div className="px-4 py-4">
        <Tabs activeTab={activeTab} onTabChange={onTabChange} items={directory} />
        <div className="py-8">
          <Status />
        </div>
        <div className="pb-8">
          <VuMeter />
        </div>
        <div className="pb-8">
          <Filters />
        </div>
      </div>
    </Page>
  );
};

export default Dsp;
