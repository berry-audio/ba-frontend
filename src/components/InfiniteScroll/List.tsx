import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { FolderSimpleIcon } from "@phosphor-icons/react";
import { AnyItem } from "@/types";
import { ICON_SM, ICON_WEIGHT } from "@/constants";
import { ALPHABETS } from "@/constants/states";

import useVirtual from "react-cool-virtual";
import NoItems from "@/components/Item/NoItems";
import LayoutHeightWrapper from "@/components/Wrapper/LayoutHeightWrapper";
import ItemWrapper from "@/components/Wrapper/ItemWrapper";
import ListItem from "../Item/ListItem";
import ButtonIcon from "../Button/ButtonIcon";
import ListItemSkeleton from "../Item/ListItemSkeleton";

interface List {
  uri: string;
  getDirectory: (uri?: string, limit?: number, offset?: number) => Promise<[]>;
  onClickCallback?: (item: AnyItem) => void;
  onEvent?: (event: string, payload: any, setItems: React.Dispatch<React.SetStateAction<AnyItem[]>>) => void;
  emptyComponent?: React.ReactNode;
  alphabets?: boolean;
  favourite?: boolean;
}

const List = ({ uri, getDirectory, onClickCallback, onEvent, emptyComponent, alphabets, favourite = false }: List) => {
  const loadMoreCount = 20;
  const action = useSelector((state: any) => state.event);

  const startOffsetRef = useRef(0);
  const selectedAlphaRef = useRef("All");
  const currentUriRef = useRef(uri);

  const [items, setItems] = useState<AnyItem[]>([...Array(loadMoreCount).fill(false)]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedAlpha, setSelectedAlpha] = useState<string>("All");

  const {
    outerRef,
    innerRef,
    items: virtualRows,
    scrollTo,
  } = useVirtual<HTMLDivElement, HTMLDivElement>({
    itemCount: items.length,
    itemSize: 72,
    loadMoreCount: loadMoreCount,
    overscanCount: loadMoreCount * 2,
    loadMore: async ({ startIndex }) => {
      const currentOffset = startIndex;
      if (currentOffset > startOffsetRef.current && selectedAlphaRef.current === "All") {
        startOffsetRef.current = currentOffset;
        setItems((prev: AnyItem[]) => [...prev, ...Array(loadMoreCount).fill(false)]);
        const response = await getDirectory(currentUriRef.current, loadMoreCount, currentOffset);
        setItems((prev: AnyItem[]) => [...prev.filter(Boolean), ...response]);
      }
    },
  });

  useEffect(() => {
    if (action.event && onEvent) {
      onEvent(action.event, action.payload, setItems);
    }
  }, [action]);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      currentUriRef.current = uri;
      selectedAlphaRef.current = "All";
      startOffsetRef.current = 0;
      setSelectedAlpha("All");
      const response = await getDirectory(uri, loadMoreCount, 0);
      setItems(response);
      scrollTo(0);
      setIsLoading(false);
    };
    fetch();
  }, [uri]);

  const onClickAlphabet = async (alphabet: string) => {
    setIsLoading(true);
    try {
      setSelectedAlpha(alphabet);
      selectedAlphaRef.current = alphabet;
      const target = alphabet === "All" ? uri : `${uri}:${alphabet}`;
      currentUriRef.current = target;
      const response = await getDirectory(target, loadMoreCount, 0);
      startOffsetRef.current = 0;
      setItems(response);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LayoutHeightWrapper className="flex overflow-hidden">
      {alphabets && (
        <div className="flex flex-col px-3 sticky h-full overflow-y-auto">
          {ALPHABETS.map((alphabet) => (
            <ButtonIcon
              key={alphabet}
              onClick={() => onClickAlphabet(alphabet)}
              className={`py-1 ${selectedAlpha === alphabet ? "text-primary" : ""}`}
            >
              {alphabet}
            </ButtonIcon>
          ))}
        </div>
      )}

      <div ref={outerRef} className={`flex-1 overflow-y-auto lg:ml-0 ${alphabets ? "-ml-4" : ""}`}>
        {isLoading && Array.from({ length: 6 }).map((_, i) => <ListItemSkeleton key={i} />)}
        {!isLoading &&
          !items.length &&
          (emptyComponent ? (
            emptyComponent
          ) : (
            <NoItems title="Empty List" desc="Nothing to show here" icon={<FolderSimpleIcon weight={ICON_WEIGHT} size={ICON_SM} />} />
          ))}
        {!isLoading && (
          <div ref={innerRef}>
            {virtualRows.map(({ index }) => {
              const item = items[index];
              if (!item) {
                return <ListItemSkeleton key={index} />;
              }
              return (
                <ItemWrapper key={index}>
                  <ListItem item={item} onClick={() => onClickCallback?.(item)} favourite={favourite} />
                </ItemWrapper>
              );
            })}
          </div>
        )}
      </div>
    </LayoutHeightWrapper>
  );
};

export default List;
