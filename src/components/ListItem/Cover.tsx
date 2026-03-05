import Directory from "./directory";
import TruncateText from "../TruncateText";
import Spinner from "../Spinner";
import React, { useState } from "react";

import { REF } from "@/constants/refs";
import { Item } from "@/types";
import { getSubtitle } from ".";
import { getImage } from "@/util";

interface Cover {
  loading?: boolean;
  item: Item;
  view?: REF;
  shadow?: boolean;
  actions?: React.ReactNode;
  onClick?: () => void;
  cover_only?: boolean;
}

const Cover = ({ item, view = REF.TRACK, loading = false, shadow = false, actions, onClick, cover_only = false }: Cover) => {
  const title = item?.name;
  const item_type = item?.type;
  const subtitle = getSubtitle(item, view);
  const image = getImage(item?.images?.[0]?.uri);

  const [imgError, setImgError] = useState(false);

  return (
    <div className="w-full">
      <button onClick={onClick} className="w-full cursor-pointer  shadow-1xl">
        <div className={`overflow-hidden rounded-md transition-all relative  ${shadow ?? "shadow-[1px_14px_21px_-6px_rgba(0,0,0,0.1)]"}`}>
          {loading && (
            <div className="absolute w-full h-full flex items-center justify-center z-10 dark:bg-black/80 bg-white/80">
              <Spinner />
            </div>
          )}

          {image && !imgError ? (
            <img src={image} alt={title} className="object-cover w-full scale-101 aspect-square grayscale-25 " onError={() => setImgError(true)} />
          ) : (
            <Directory type={item_type} />
          )}
        </div>
      </button>
      {!cover_only && (
        <div className="flex justify-between">
          <div className="overflow-hidden text-left">
            {title && (
              <h2 className={`text-lg font-medium tracking-tight `}>
                <TruncateText>{title}</TruncateText>
              </h2>
            )}

            {subtitle && (
              <div className="text-secondary font-medium">
                <TruncateText>{subtitle}</TruncateText>
              </div>
            )}
          </div>
          {actions && <div className="-mr-2">{actions}</div>}
        </div>
      )}
    </div>
  );
};

export default React.memo(Cover);
