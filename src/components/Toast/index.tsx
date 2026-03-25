import { toast } from "sonner";
import { CheckCircleIcon, InfoIcon, WarningCircleIcon, XCircleIcon } from "@phosphor-icons/react";
import { ICON_FILL, ICON_SM } from "@/constants";

import ButtonIcon from "../Button/ButtonIcon";

const icons = {
  success: <CheckCircleIcon  weight={ICON_FILL} size={ICON_SM} className="text-emerald-500"  />,
  error: <XCircleIcon  weight={ICON_FILL} size={ICON_SM} className="text-primary" />,
  warning: <WarningCircleIcon  weight={ICON_FILL} size={ICON_SM} className="text-yellow-600"  />,
  info: <InfoIcon  weight={ICON_FILL} size={ICON_SM} className="text-white" />,
};

interface ToastContentProps {
  id: string | number;
  title: string;
  description?: string;
  variant: "success" | "error" | "warning" | "info";
}

export const ToastContent = ({ id, title, description, variant }: ToastContentProps) => {
  return (
    <div className="flex items-center w-full bg-neutral-950 border border-none rounded-lg p-4 shadow-2xl">
      <div className="flex items-start gap-3 flex-1">
        <span>{icons[variant]}</span>
        <div className="flex flex-col gap-1 mt-0.5">
          <span className="text-white text-sm">{title}</span>
          {description && <span className="text-neutral-400 text-sm">{description}</span>}
        </div>
      </div>
      <ButtonIcon className="h-10 w-10 shrink-0" onClick={() => toast.dismiss(id)}>
        ✕
      </ButtonIcon>
    </div>
  );
};
