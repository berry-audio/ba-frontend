import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FolderSimpleIcon } from "@phosphor-icons/react";
import { AnyItem } from "@/types";
import { REF } from "@/constants/refs";
import { ICON_SM, ICON_WEIGHT } from "@/constants";
import { DIALOG_EVENTS } from "@/store/constants";
import { ALPHABETS } from "@/constants/states";

import NoItems from "@/components/Item/NoItems";
import useVirtual from "react-cool-virtual";
import LayoutHeightWrapper from "@/components/Wrapper/LayoutHeightWrapper";
import GridItem from "../Item/GridItem";
import ButtonIcon from "../Button/ButtonIcon";
import GridItemSkeleton from "../Item/GridItemSkeleton";

interface Grid {
  uri: string;
  getDirectory: (uri?: string, limit?: number, offset?: number) => Promise<[]>;
  onClickCallback?: (item: AnyItem) => void;
  onEvent?: (event: string, payload: any, setItems: React.Dispatch<React.SetStateAction<AnyItem[]>>) => void;
  emptyComponent?: React.ReactNode;
  alphabets?: boolean;
  favourite?: boolean;
}

const calculateCols = () => {
  if (window.innerWidth < 576) return 2;
  else if (window.innerWidth < 940) return 3;
  else if (window.innerWidth < 1024) return 4;
  else if (window.innerWidth < 1440) return 5;
  else if (window.innerWidth < 1600) return 6;
  else return 9;
};

const Grid = ({ uri, getDirectory, onClickCallback, onEvent, emptyComponent, alphabets, favourite = false }: Grid) => {
  const dispatch = useDispatch();

  const loadMoreCount = 20;
  const action = useSelector((state: any) => state.event);

  const startOffsetRef = useRef(0);
  const selectedAlphaRef = useRef("All");
  const currentUriRef = useRef(uri);

  const [columns, setColumns] = useState(calculateCols());
  const [items, setItems] = useState<AnyItem[]>([...Array(loadMoreCount * columns).fill(false)]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [itemSize, setItemSize] = useState<number>();
  const [selectedAlpha, setSelectedAlpha] = useState<string>("All");

  const {
    outerRef,
    innerRef,
    items: virtualRows,
    scrollTo,
  } = useVirtual<HTMLDivElement, HTMLDivElement>({
    itemCount: Math.ceil(items.length / columns),
    itemSize: itemSize,
    useIsScrolling: true,
    overscanCount: loadMoreCount * columns * 2,
    loadMoreCount: loadMoreCount,
    loadMore: async ({ startIndex }) => {
      const currentOffset = startIndex * columns;

      if (currentOffset > startOffsetRef.current && selectedAlphaRef.current === "All") {
        startOffsetRef.current = currentOffset;

        setItems((prev: AnyItem[]) => [...prev, ...Array(loadMoreCount * columns).fill(false)]);
        const response = await getDirectory(uri, loadMoreCount * columns, currentOffset);
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
      const response = (await getDirectory(currentUriRef.current, loadMoreCount * columns, 0)) || [];
      if (!response.length && [REF.ARTIST, REF.ALBUM, REF.GENRE, REF.TRACK].includes(currentUriRef.current as REF)) {
        dispatch({ type: DIALOG_EVENTS.DIALOG_ADD_LIBRARY });
      }
      setItems(response);
      scrollTo(0);
      setIsLoading(false);
    };
    fetch();
  }, [uri]);

  useEffect(() => {
    const handler = () => {
      setColumns(calculateCols());
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const onClickAlphabet = async (alphabet: string) => {
    setIsLoading(true);

    try {
      setSelectedAlpha(alphabet);
      selectedAlphaRef.current = alphabet;
      const target = alphabet === "All" ? uri : `${uri}:${alphabet}`;
      currentUriRef.current = target;
      const response = await getDirectory(target, loadMoreCount * columns, 0);
      startOffsetRef.current = 0;
      setItems(response);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LayoutHeightWrapper className="flex overflow-hidden">
      {alphabets && (
        <div className="flex flex-col px-2 sticky h-full overflow-y-auto overflow-x-hidden">
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

      <div ref={outerRef} className="flex-1 overflow-y-auto overflow-x-hidden pr-4 -ml-2">
        {isLoading && (
          <div className={`${!alphabets && "pl-3"}`}>
            <div className="flex items-start flex-wrap">
              {Array.from({ length: columns * 3 }).map((_, i) => (
                <GridItemSkeleton key={i} style={{ width: `${100 / columns}%` }} />
              ))}
            </div>
          </div>
        )}

        {!isLoading && !items?.length ? (
          emptyComponent ? (
            emptyComponent
          ) : (
            <NoItems title="Empty List" desc="Nothing to show here" icon={<FolderSimpleIcon weight={ICON_WEIGHT} size={ICON_SM} />} />
          )
        ) : null}

        {!isLoading && (
          <div ref={innerRef} className={`${!alphabets && "pl-3"}`}>
            {virtualRows.map(({ index }) => {
              const start = index * columns;
              const rowItems = items.slice(start, start + columns);
              const hasItems = rowItems.some(Boolean);

              if (!hasItems) {
                return (
                  <div key={index} className="flex items-start">
                    {Array.from({ length: columns }).map((_, i) => (
                      <GridItemSkeleton key={i} style={{ width: `${100 / columns}%` }} />
                    ))}
                  </div>
                );
              }

              return (
                <div key={index} className="flex items-start">
                  {rowItems.map((item: any, i: number) => (
                    <GridItem
                      key={i}
                      item={item}
                      onClick={() => onClickCallback?.(item)}
                      style={{ width: `${100 / columns}%` }}
                      onMeasure={(value) => !itemSize && setItemSize(Math.round(value))}
                      showFavourite={favourite}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </LayoutHeightWrapper>
  );
};

export default Grid;
