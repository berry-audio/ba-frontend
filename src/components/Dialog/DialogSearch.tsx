import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchService } from "@/services/search";
import { RootState } from "@/store";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { Input } from "@/components/Form/Input";
import { AnyItem, Artist, Album, Category } from "@/types";
import { ICON_SM, ICON_WEIGHT } from "@/constants";
import { DRAWER_EVENTS, OVERLAY_EVENTS } from "@/store/constants";
import { DIALOG_EVENTS } from "@/store/constants";
import { MODEL, REF } from "@/constants/refs";

import ListItemSkeleton from "../Item/ListItemSkeleton";
import VirtualScroll from "../VirtualScroll";
import NoItems from "@/components/Item/NoItems";
import Modal from "../Modal";
import Tabs from "../ui/tabs";

const DialogSearch = () => {
  const { dialog } = useSelector((state: RootState) => state.dialog);
  const dispatch = useDispatch();

  const { getSearch } = useSearchService();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<any>({});
  const [filteredResults, setFilteredResults] = useState<AnyItem[]>([]);

  const [query, setQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<REF>(REF.ALL);
  const [directory, setDirectory] = useState<Record<string, { title: string }>>({
    [REF.ALL]: {
      title: "All",
    },
  });

  const directoryItems = {
    [REF.ALL]: {
      title: "All",
    },
    [REF.ALBUM]: {
      title: "Albums",
    },
    [REF.ARTIST]: {
      title: "Artists",
    },
    [REF.TRACK]: {
      title: "Tracks",
    },
    [REF.RADIO]: {
      title: "Radio",
    },
  } as const;

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    let isActive = true;

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await getSearch(query.trim());
        if (isActive) {
          setResults(response || {});
          setFilteredResults(Object.values(response || {}).flat() as []);

          const availableTabs = {
            [REF.ALL]: directoryItems[REF.ALL],
            ...Object.fromEntries(Object.entries(directoryItems).filter(([key]) => key !== REF.ALL && key in response)),
          };
          setDirectory(availableTabs);
        }
      } catch (error) {
        if (isActive) {
          setResults({});
          setFilteredResults([]);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }, 500);

    return () => {
      isActive = false;
      clearTimeout(timeoutId);
    };
  }, [query]);

  const hasResults = Object.values(results).some((arr) => Array.isArray(arr) && arr.length > 0);

  const onClickItem = (item: AnyItem) => {
    if (item.__model__ === MODEL.TRACK) return;
    const [ext, view, id] = (item as Artist | Album | Category).uri.split(":");
    dispatch({ type: OVERLAY_EVENTS.OVERLAY_CLOSE });
    dispatch({
      type: DRAWER_EVENTS.DRAWER_LOCAL,
      payload: { ext, view, id },
    });
  };

  const onChangeField = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const onTabChange = (tab: REF) => {
    setActiveTab(tab);

    const filteredResults = Object.entries(results)
      .filter(([table]) => tab === REF.ALL || table === tab)
      .flatMap(([, items]) => items) as AnyItem[];

    setFilteredResults(filteredResults);
  };

  const onClear = () => {
    setQuery("");
    setResults({});
    setFilteredResults([]);
    setActiveTab(REF.ALL);
    setIsLoading(false);
  };

  return (
    <Modal
      title="Search"
      onClose={() => dispatch({ type: DIALOG_EVENTS.DIALOG_CLOSE })}
      isOpen={dialog === DIALOG_EVENTS.DIALOG_SEARCH}
      buttonShow={false}
      size="w-150"
    >
      <div>
        <Input
          type="text"
          placeholder="Albums, Artists, Tracks, Radio..."
          value={query}
          onChange={onChangeField}
          onClickClear={onClear}
          className="my-1"
        />
      </div>
      {hasResults && (
        <div className="my-4">
          <Tabs activeTab={activeTab} onTabChange={onTabChange} items={directory} />
        </div>
      )}

      <div className="-mx-5">
        {isLoading && Array.from({ length: 2 }).map((_, i) => <ListItemSkeleton key={i} />)}

        {!isLoading && query.trim() !== "" && !hasResults && (
          <div className="pb-10 pt-15">
            <NoItems title="No Results" desc="Try with a different keyword" icon={<MagnifyingGlassIcon weight={ICON_WEIGHT} size={ICON_SM} />} />
          </div>
        )}

        {!isLoading && hasResults && <VirtualScroll items={filteredResults} onClickItem={onClickItem} className="h-[40vh]!" />}
      </div>
    </Modal>
  );
};

export default DialogSearch;
