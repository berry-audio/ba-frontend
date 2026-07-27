import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCollectionService } from "@/services/collection";
import { useDispatch } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Keyboard, Mousewheel, Pagination, Scrollbar } from "swiper/modules";
import { CaretLeftIcon, CaretRightIcon, MusicNoteSimpleIcon } from "@phosphor-icons/react";
import { Album, AnyItem, Artist, Track } from "@/types";
import { ICON_SM, ICON_WEIGHT } from "@/constants";
import { MODEL, REF } from "@/constants/refs";
import { DRAWER_EVENTS } from "@/store/constants";
import type { Swiper as SwiperType } from "swiper";

import GridItem from "@/components/Item/GridItem";
import GridItemSkeleton from "../Item/GridItemSkeleton";
import ButtonIcon from "../Button/ButtonIcon";
import Button from "../Button";
import NoItems from "../Item/NoItems";

const Collection = ({ type, limit = 10, navigation = false }: { type: REF; limit: number; navigation?: boolean }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { getDirectory } = useCollectionService();

  const [loading, setLoading] = useState<boolean>(true);
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [items, setItems] = useState([]);

  const Header = () => {
    switch (type) {
      case REF.RECENT:
        return "Recently Played";
      case REF.TOP100:
        return "Most Played";
      case REF.FAVOURITE:
        return "Favourites";
      default:
        return "";
    }
  };

  const onClickItem = async (item: AnyItem) => {
    if (item.__model__ === MODEL.TRACK) return;
    const [ext, view, id] = (item as Artist | Album)?.uri.split(":");

    dispatch({
      type: DRAWER_EVENTS.DRAWER_LOCAL,
      payload: { ext, view, id },
    });
  };

  useEffect(() => {
    const fetchDirectory = async () => {
      const result = await getDirectory(`collection:${type}`, limit);
      setItems(result);
      setLoading(false);
    };

    fetchDirectory();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-left text-2xl">
          <Header />
        </h1>

        <div className="flex items-center -mr-2 lg:-mr-3">
          {navigation && (
            <>
              <ButtonIcon onClick={() => swiper?.slideNext()}>
                <CaretLeftIcon weight={ICON_WEIGHT} size={ICON_SM} />
              </ButtonIcon>

              <ButtonIcon onClick={() => swiper?.slidePrev()}>
                <CaretRightIcon weight={ICON_WEIGHT} size={ICON_SM} />
              </ButtonIcon>
            </>
          )}

          <Button type="ghost" size="sm" onClick={() => navigate(`/collection/${type}`)}>
            Show All
          </Button>
        </div>
      </div>

      <div className="-mx-2 lg:-mx-3">
        <Swiper
          modules={[FreeMode, Keyboard, Mousewheel, Pagination, Scrollbar]}
          onSwiper={setSwiper}
          spaceBetween={3}
          slidesPerView={2.5}
          freeMode={true}
          resistance={false}
          touchReleaseOnEdges={true}
          grabCursor={true}
          direction={"horizontal"}
          mousewheel={true}
          pagination={{
            el: ".custom-pagination",
            clickable: true,
          }}
          breakpoints={{
            640: {
              slidesPerView: 3.5,
            },
            768: {
              slidesPerView: 3.5,
            },
            1024: {
              slidesPerView: 3.5,
            },
            1280: {
              slidesPerView: 3.5,
            },
          }}
          keyboard={{
            enabled: true,
          }}
        >
          {loading ? (
            Array.from({ length: 4 }).map((_) => (
              <SwiperSlide>
                <GridItemSkeleton />
              </SwiperSlide>
            ))
          ) : items.length > 0 ? (
            items.map((item: Track) => (
              <SwiperSlide>
                <GridItem item={item} onClick={onClickItem} showFavourite/>
              </SwiperSlide>
            ))
          ) : (
            <NoItems title="" desc="No items yet" icon={<MusicNoteSimpleIcon weight={ICON_WEIGHT} size={ICON_SM} />} />
          )}
        </Swiper>
      </div>
    </div>
  );
};

export default Collection;
