import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { AnyItem, Artist, Album, Category } from "@/types";

import LayoutHeightWrapper from "@/components/Wrapper/LayoutHeightWrapper";
import ItemWrapper from "@/components/Wrapper/ItemWrapper";
import ListItem from "../Item/ListItem";

interface VirtualScrollProps {
  items: AnyItem[];
  onClickItem: (item: AnyItem) => void;
  className?: string;
  rowHeight?: number;
}

const VirtualScroll = ({ items, onClickItem, className, rowHeight = 72 }: VirtualScrollProps) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan: 8,
    measureElement: (el) => el.getBoundingClientRect().height,
  });

  return (
    <LayoutHeightWrapper className={className}>
      <div ref={parentRef} className="h-full overflow-auto">
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const item = items[virtualRow.index];
            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                style={{
                  position: "absolute",
                  top: `${virtualRow.start}px`,
                  width: "100%",
                }}
              >
                <ItemWrapper key={(item as Artist | Album | Category).uri}>
                  <ListItem item={item} onClick={() => onClickItem(item)} />
                </ItemWrapper>
              </div>
            );
          })}
        </div>
      </div>
    </LayoutHeightWrapper>
  );
};

export default VirtualScroll;