import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSearchService } from "@/services/search";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { Input } from "@/components/Form/Input";
import { Album, AnyItem, Artist, Category } from "@/types";
import { ICON_SM, ICON_WEIGHT } from "@/constants";
import { DRAWER_EVENTS, OVERLAY_EVENTS } from "@/store/constants";
import { MODEL } from "@/constants/refs";

import LayoutHeightWrapper from "@/components/Wrapper/LayoutHeightWrapper";
import NoItems from "@/components/Item/NoItems";
import Overlay from "@/components/Overlay";
import Page from "@/components/Page";
import ItemWrapper from "@/components/Wrapper/ItemWrapper";
import ListItem from "../Item/ListItem";
import ListItemSkeleton from "../Item/ListItemSkeleton";

type SearchResults = Record<string, AnyItem[]>;

interface RootState {
  overlay: {
    overlay: string;
  };
}

const OverlaySearch = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { overlay } = useSelector((state: RootState) => state.overlay);
  const { getSearch } = useSearchService();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<SearchResults>({});
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    if (!query.trim()) {
      setResults({});
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
        }
      } catch (error) {
        if (isActive) {
          setResults({});
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

  const title: Record<string, string> = {
    album: "Albums",
    artist: "Artists",
    track: "Tracks",
    genre: "Genre",
    radio: "Radio",
  };

  const hasResults = Object.values(results).some((arr) => Array.isArray(arr) && arr.length > 0);

  const onClickItem = (item: AnyItem) => {
    if (item.__model__ === MODEL.TRACK) return;
    const [view, id] = (item as Artist | Album | Category).uri.split(":");
    dispatch({ type: OVERLAY_EVENTS.OVERLAY_CLOSE });
    dispatch({
      type: DRAWER_EVENTS.DRAWER_LOCAL,
      payload: { view, id },
    });
  };

  const onChangeField = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsLoading(true);
  };

  const onClear = () => {
    setQuery("");
    setResults({});
    setIsLoading(false);
  };

  return (
    <Overlay show={overlay === OVERLAY_EVENTS.OVERLAY_SEARCH} zindex={10} style={{ zIndex: 100 }} hideplayer>
      <Page title="Search" backButtonOnClick={() => dispatch({ type: OVERLAY_EVENTS.OVERLAY_CLOSE })} backButton>
        <div className="px-4 mb-4">
          <Input type="text" placeholder="Search Albums, Artists, Tracks, Radio..." value={query} onChange={onChangeField} onClickClear={onClear} />
        </div>

        <div>
          {isLoading && Array.from({ length: 6 }).map((_, i) => <ListItemSkeleton key={i} />)}

          {!isLoading && query.trim() !== "" && !hasResults && (
            <LayoutHeightWrapper>
              <NoItems title="No Results" desc="Try with a different keyword" icon={<MagnifyingGlassIcon weight={ICON_WEIGHT} size={ICON_SM} />} />
            </LayoutHeightWrapper>
          )}

          {!isLoading && hasResults && (
            <LayoutHeightWrapper>
              {Object.entries(results).map(
                ([table, items]: [string, AnyItem[]]) =>
                  items.length > 0 && (
                    <div key={table} className="mt-4">
                      <h2 className="pl-5 font-bold text-lg">{title[table] || table}</h2>

                      <ul className="list-disc">
                        {items.map((item: AnyItem) => (
                          <ItemWrapper key={(item as Artist | Album | Category).uri}>
                            <ListItem item={item} onClick={() => onClickItem(item)} />
                          </ItemWrapper>
                        ))}
                      </ul>
                    </div>
                  ),
              )}
            </LayoutHeightWrapper>
          )}
        </div>
      </Page>
    </Overlay>
  );
};

export default OverlaySearch;
