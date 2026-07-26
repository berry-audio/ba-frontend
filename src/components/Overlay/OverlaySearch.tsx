import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchService } from "@/services/search";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { Input } from "@/components/Form/Input";
import { AnyItem, Artist, Album, Category } from "@/types";
import { ICON_SM, ICON_WEIGHT } from "@/constants";
import { DRAWER_EVENTS, OVERLAY_EVENTS } from "@/store/constants";
import { MODEL, REF } from "@/constants/refs";

import LayoutHeightWrapper from "@/components/Wrapper/LayoutHeightWrapper";
import ListItemSkeleton from "../Item/ListItemSkeleton";
import VirtualScroll from "../VirtualScroll";
import NoItems from "@/components/Item/NoItems";
import Overlay from "@/components/Overlay";
import Page from "@/components/Page";
import Tabs from "../ui/tabs";

interface RootState {
  overlay: {
    overlay: string;
  };
}

const OverlaySearch = () => {
  const dispatch = useDispatch();

  const { overlay } = useSelector((state: RootState) => state.overlay);
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
    setIsLoading(true);
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
    setActiveTab(REF.ALL)
    setIsLoading(false);
  };

  return (
    <Overlay show={overlay === OVERLAY_EVENTS.OVERLAY_SEARCH} zindex={10} style={{ zIndex: 100 }} hideplayer>
      <Page title="Search" backButtonOnClick={() => dispatch({ type: OVERLAY_EVENTS.OVERLAY_CLOSE })} backButton>
        <div className="px-4 mb-4">
          <Input type="text" placeholder="Search Albums, Artists, Tracks, Radio..." value={query} onChange={onChangeField} onClickClear={onClear} />
        </div>
        {hasResults && (
          <div className="px-4 mb-4">
            <Tabs activeTab={activeTab} onTabChange={onTabChange} items={directory} />
          </div>
        )}

        <div>
          {isLoading && Array.from({ length: 6 }).map((_, i) => <ListItemSkeleton key={i} />)}

          {!isLoading && query.trim() !== "" && !hasResults && (
            <LayoutHeightWrapper>
              <NoItems title="No Results" desc="Try with a different keyword" icon={<MagnifyingGlassIcon weight={ICON_WEIGHT} size={ICON_SM} />} />
            </LayoutHeightWrapper>
          )}

          {!isLoading && hasResults && (
            <VirtualScroll items={filteredResults} onClickItem={onClickItem} className="lg:h-[calc(100dvh-260px)]! h-[calc(100dvh-220px)]!" />
          )}
        </div>
      </Page>
    </Overlay>
  );
};

export default OverlaySearch;
