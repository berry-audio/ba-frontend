import React, { ReactNode, useEffect, useState } from "react";
import ButtonIcon from "../Button/ButtonIcon";
import Button from "../Button";

interface ModalProps {
  buttonShow?: boolean;
  buttonText?: string;
  buttonLoading?: boolean;
  buttonDisabled?: boolean;
  buttonOnClick?: () => void;
  isOpen: boolean;
  onClose: () => void;
  hideClose?: boolean;
  title?: string;
  children?: ReactNode;
  padding?: boolean;
  size?: string;
  zindexOverlay?: number;
  zindexModal?: number;
}

const Modal: React.FC<ModalProps> = ({
  buttonShow = true,
  buttonText,
  buttonLoading,
  buttonDisabled,
  buttonOnClick,
  isOpen,
  onClose,
  hideClose = false,
  title,
  children,
  padding = false,
  size = "w-130",
  zindexOverlay = 90,
  zindexModal = 250,
}) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const raf = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(raf);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const closeDialog = () => {
    setIsVisible(false);
    setTimeout(() => {
      setShouldRender(false);
      onClose();
    }, 300);
  };

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-${zindexOverlay} flex items-center justify-center backdrop-blur-md bg-overlay transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeDialog();
      }}
    >
      <div
        className={`bg-dialog rounded-2xl shadow-xl ${size} mx-4 overflow-hidden z-${zindexModal} relative md:px-3 transition-all duration-300 ease-in-out ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-6">
          {title && <h2 className="text-2xl font-light">{title}</h2>}
          {!hideClose && (
            <ButtonIcon className="-right-4" onClick={closeDialog}>
              ✕
            </ButtonIcon>
          )}
        </div>

        {/* Body */}
        <div
          className={`overflow-auto relative z-50 ${buttonShow ? "max-h-[50vh] md:max-h-[80vh]" : "max-h-[60vh] md:max-h-[90vh]"} ${!padding ? "px-5" : ""}`}
        >
          {children}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-5">
          {buttonShow && (
            <Button type="ghost" onClick={buttonOnClick} disabled={buttonLoading || buttonDisabled} loading={buttonLoading}>
              {buttonText ? buttonText : "Ok"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
