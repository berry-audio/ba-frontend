import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useMultiroomService } from "@/services/multiroom";
import { useMultiroomActions } from "@/hooks/useMultiroomActions";
import { Slider } from "@/components/Form/Slider";
import { RoomServer } from "@/types";
import { GearIcon, HardDriveIcon, NetworkSlashIcon, SpeakerHifiIcon, SpeakerHighIcon, SpeakerSlashIcon } from "@phosphor-icons/react";
import { EVENTS } from "@/constants/events";
import { INTERNAL_EVENTS } from "@/store/constants";
import { MODEL } from "@/constants/refs";
import { ICON_SM, ICON_WEIGHT, LOCAL_IP } from "@/constants";

import Page from "@/components/Page";
import LayoutHeightWrapper from "@/components/Wrapper/LayoutHeightWrapper";
import NoItems from "@/components/Item/NoItems";
import ButtonMulitroomScan from "@/components/Button/ButtonMultiroomScan";
import ButtonIcon from "@/components/Button/ButtonIcon";
import ListItem from "@/components/Item/ListItem";
import ListItemSkeleton from "@/components/Item/ListItemSkeleton";

const ListClient = ({ client, item }: { client: any; item: any }) => {
  const dispatch = useDispatch();
  const { setVolume } = useMultiroomService();

  const { id, config } = client;
  const { percent, muted } = config?.volume;

  const [volumeLevel, setvolumeLevel] = useState<any>(percent);
  const [mute, setMute] = useState<boolean>(muted ?? false);

  const onClickToggleMuteHandler = async () => {
    const response = await setVolume(item.ip, id, percent, !mute);
    setMute(response.volume.muted);
  };

  const onCommittedVolume = async ([value]: number[]) => {
    try {
      dispatch({ type: INTERNAL_EVENTS.MULTIROOM_VOLUME_DRAGGING, payload: false });
      dispatch({
        type: EVENTS.MULTIROOM_NOTIFICATION,
        payload: {
          method: "Client.OnVolumeChanged",
          params: {
            id,
            volume: {
              percent: value,
              muted: muted,
            },
          },
        },
      });
      setMute(false);
    } catch (error) {
      throw error;
    }
  };

  const onChangeVolume = ([value]: number[]) => {
    dispatch({ type: INTERNAL_EVENTS.MULTIROOM_VOLUME_DRAGGING, payload: true });
    setvolumeLevel(value);
    setVolume(item.ip, id, value);
  };

  useEffect(() => {
    setvolumeLevel(percent);
  }, [percent]);

  return (
    <div className="pt-3 md:pt-0">
      <ListItem item={{ __model__: MODEL.ROOM_DEVICE, ...client }} />
      <div className="flex items-center my-3 mx-5">
        <div className="mr-4">
          <ButtonIcon onClick={onClickToggleMuteHandler}>
            {mute ? (
              <SpeakerSlashIcon size={ICON_SM} weight={ICON_WEIGHT} className="text-disabled" />
            ) : (
              <SpeakerHighIcon size={ICON_SM} weight={ICON_WEIGHT} />
            )}
          </ButtonIcon>
        </div>
        <Slider
          value={[volumeLevel]}
          max={100}
          step={1}
          className="w-full md:w-80"
          onValueChange={onChangeVolume}
          onValueCommit={onCommittedVolume}
          disabled={false}
        />
      </div>
    </div>
  );
};

const ListServer = ({ item }: { item: RoomServer }) => {
  const connectedClients = item.status?.server?.groups?.flatMap((group: any) => group.clients?.filter((client: any) => client.connected) ?? []) ?? [];

  return (
    <div className="bg-secondary mb-4 py-2 shadow-sm lg:rounded-md">
      <div className="flex justify-between border-b border-neutral-200 pb-2 dark:border-neutral-800 md:mb-2">
        <ListItem item={item} />
      </div>

      {connectedClients.length > 0 ? (
        <div>
          {connectedClients.map((client: any, index: number) => (
            <ListClient client={client} item={item} key={client.id || index} />
          ))}
        </div>
      ) : item.status?.server ? (
        <div className="pt-4">
          <NoItems
            title={item.ip === LOCAL_IP ? "No devices listening" : "No devices connected"}
            desc={item.ip === LOCAL_IP ? "Join from another device to start listening" : "Join to start listening from this room"}
            icon={<SpeakerHifiIcon weight={ICON_WEIGHT} size={ICON_SM} />}
          />
        </div>
      ) : (
        <div className="pt-4">
          <NoItems
            title={"Room is offline"}
            desc={"Room server disabled or turned off"}
            icon={<NetworkSlashIcon weight={ICON_WEIGHT} size={ICON_SM} />}
          />
        </div>
      )}
    </div>
  );
};

const Multiroom = () => {
  const navigate = useNavigate();
  const { servers } = useSelector((state: any) => state.multiroom, shallowEqual);
  const { fetchServers, loading } = useMultiroomActions();

  useEffect(() => {
    fetchServers();
  }, []);

  return (
    <Page
      backButton
      title="Multiroom"
      rightComponent={
        <div className="flex">
          <div className="mr-4">
            <ButtonMulitroomScan />
          </div>

          <div className="mr-4">
            <ButtonIcon onClick={() => navigate("/settings/multiroom")}>
              <GearIcon weight={ICON_WEIGHT} size={ICON_SM} />
            </ButtonIcon>
          </div>
        </div>
      }
    >
      {loading ? (
        <LayoutHeightWrapper>
          <div className="bg-secondary mb-4 py-2 shadow-sm lg:rounded-md">
            <div className="flex justify-between md:mb-2 border-b border-neutral-200 dark:border-neutral-800 pb-2">
              <ListItemSkeleton />
            </div>

            <ListItemSkeleton />
            <ListItemSkeleton />
          </div>
        </LayoutHeightWrapper>
      ) : (
        <>
          {servers.length ? (
            [...servers]
              .sort((a: RoomServer, b: RoomServer) => {
                if (a.ip === LOCAL_IP) return -1;
                if (b.ip === LOCAL_IP) return 1;
                return a.name.localeCompare(b.name);
              })
              .map((item: RoomServer, index: number) => <ListServer key={index} item={item} />)
          ) : (
            <LayoutHeightWrapper>
              <NoItems
                title="No rooms found"
                desc="Scan for available rooms on the network"
                icon={<HardDriveIcon weight={ICON_WEIGHT} size={ICON_SM} />}
              />
            </LayoutHeightWrapper>
          )}
        </>
      )}
    </Page>
  );
};

export default Multiroom;
