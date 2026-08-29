import { useSelector } from "react-redux";
import { useDspActions } from "@/hooks/useDspActions";
import { DisplayChannel } from "../Mixers/Mixer";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { calculateInChannels } from "@/util";

import Stage from "./Stage";
import ButtonStageAdd from "@/components/Button/ButtonStageAdd";

interface DspState {
  dsp: {
    config?: {
      pipeline?: any[];
    };
  };
}

const Pipeline = () => {
  const { config } = useSelector((state: DspState) => state.dsp);
  const { moveStage } = useDspActions();

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.index === destination.index) return;

    const reorderedStages = [...config?.pipeline];
    const [moved] = reorderedStages.splice(source.index, 1);
    reorderedStages.splice(destination.index, 0, moved);

    await moveStage(reorderedStages);
  };

  return (
    <>
      <div className="bg-dialog rounded-md w-full mb-4 py-5 px-6 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center min-w-0">
            <div className="bg-cover text-primary rounded-md w-12 h-12 flex items-center justify-center text-xl mr-3 shrink-0">IN</div>
            <div className="min-w-0">
              Capture Device
              <div className="text-secondary text-md truncate pr-10">{config?.devices.capture.device}</div>
            </div>
          </div>

          <DisplayChannel text="OUT" count={config?.devices.capture.channels} />
        </div>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {config?.pipeline?.map((stage, key) => (
                <Draggable key={key} draggableId={`${key}`} index={key}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`overflow-hidden md:overflow-visible ${snapshot.isDragging ? "rounded-md" : ""}`}
                    >
                      <Stage
                        key={key}
                        index={key}
                        stage={stage}
                        channelsCount={calculateInChannels(config, key)}
                        dragHandleProps={provided.dragHandleProps}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="flex items-center justify-center mt-8">
        <ButtonStageAdd />
      </div>
    </>
  );
};

export default Pipeline;
