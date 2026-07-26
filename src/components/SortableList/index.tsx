import { useEffect, useState, useCallback, useRef, memo } from "react";
import { useSelector } from "react-redux";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useVirtualizer } from "@tanstack/react-virtual";
import { DotsSixVerticalIcon } from "@phosphor-icons/react";
import { ICON_SM, ICON_WEIGHT } from "@/constants";
import { TlTrack } from "@/types";

import ItemWrapper from "../Wrapper/ItemWrapper";
import ListItem from "../Item/ListItem";

const reorder = (list: TlTrack[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const Row = memo(function Row({ item, index, top, selectedTlid }: { item: TlTrack; index: number; top: number; selectedTlid?: number | string }) {
  return (
    <Draggable key={item.tlid} draggableId={`${item.tlid}`} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            position: "absolute",
            top,
            width: "100%",
            ...provided.draggableProps.style,
          }}
          className={`overflow-hidden md:overflow-visible ${snapshot.isDragging ? "bg-hover rounded-md" : ""}`}
        >
          <ItemWrapper>
            <DotsSixVerticalIcon weight={ICON_WEIGHT} size={ICON_SM} className="-mr-3 ml-1" />
            <ListItem item={item} selected={item.tlid === selectedTlid} showFavourite />
          </ItemWrapper>
        </div>
      )}
    </Draggable>
  );
});

export default function SortableList({
  tracks,
  onMoveCallback,
  onEvent,
  itemSize = 72,
}: {
  tracks: TlTrack[];
  onMoveCallback?: (start: number, end: number, to_position: number) => void;
  onEvent?: (event: string, payload: any, setItems: React.Dispatch<React.SetStateAction<TlTrack[]>>) => void;
  height?: number;
  itemSize?: number;
}) {
  const action = useSelector((state: any) => state.event);
  const { current_track } = useSelector((state: any) => state.player);
  const [items, setItems] = useState<TlTrack[]>(tracks);
  const [containerHeight, setContainerHeight] = useState(0);

  const selectedTlid = current_track?.tlid;
  const parentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = parentRef.current;
    if (!node) return;

    const updateHeight = () => {
      const top = node.getBoundingClientRect().top;
      const available = window.innerHeight - top;
      setContainerHeight(available - 40);
    };

    updateHeight();

    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  useEffect(() => {
    setItems(tracks);
  }, [tracks]);

  useEffect(() => {
    if (action.event && onEvent) {
      onEvent(action.event, action.payload, setItems);
    }
  }, [action, onEvent]);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;

      const newItems = reorder(items, result.source.index, result.destination.index);
      setItems(newItems);
      onMoveCallback?.(result.source.index, result.source.index + 1, result.destination.index);
    },
    [items, onMoveCallback],
  );

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemSize,
    overscan: 6,
  });

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable
        droppableId="droppable"
        mode="virtual"
        
        renderClone={(provided, snapshot, rubric) => {
          const item = items[rubric.source.index];
          return (
            <div
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={{ ...provided.draggableProps.style, height: itemSize }}
              className={`overflow-hidden md:overflow-visible ${snapshot.isDragging ? "bg-hover rounded-md" : ""}`}
            >
              <ItemWrapper>
                <DotsSixVerticalIcon weight={ICON_WEIGHT} size={ICON_SM} className="-mr-3 ml-1" />
                <ListItem item={item} selected={item?.tlid === selectedTlid} showFavourite />
              </ItemWrapper>
            </div>
          );
        }}
      >
        {(provided) => (
          <div
            ref={(node) => {
              parentRef.current = node;
              provided.innerRef(node);
            }}
            className="overflow-y-auto"
            style={{ height: containerHeight }}
          >
            <div style={{ height: rowVirtualizer.getTotalSize(), position: "relative", width: "100%" }}>
              {rowVirtualizer.getVirtualItems().map((virtualRow) => (
                <Row
                  key={items[virtualRow.index].tlid}
                  item={items[virtualRow.index]}
                  index={virtualRow.index}
                  top={virtualRow.start}
                  selectedTlid={selectedTlid}
                />
              ))}
            </div>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
