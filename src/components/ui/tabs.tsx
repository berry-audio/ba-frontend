import { REF } from "@/constants/refs";
import { TitleTabsProps } from "@/types";

const Tabs: React.FC<TitleTabsProps> = ({ items, activeTab, onTabChange }) => {
  return (
    <div className="flex gap-1 overflow-x-auto">
      {Object.entries(items).map(([key, { title }]) => (
        <button
          key={key}
          onClick={() => onTabChange?.(key as REF)}
          className={`px-3 py-2.5 rounded-full transition-colors whitespace-nowrap cursor-pointer flex items-center text-md ${
            activeTab === key ? "bg-primary" : "hover:bg-hover"
          }`}
        >
          {title}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
