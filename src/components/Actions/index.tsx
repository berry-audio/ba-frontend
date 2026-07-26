import Spinner from "../Spinner";
import ButtonIcon from "../Button/ButtonIcon";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { DotsThreeIcon } from "@phosphor-icons/react";
import { ICON_SM } from "@/constants";
import { MenuItem } from "@/hooks/useMenuActions";

const ActionMenu = ({ items }: { items: MenuItem[] }) => {
  const [loading, setLoading] = useState<Set<number>>(new Set());
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);

  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
  });

  const toggleDropdown = () => {
    if (!isDropdownOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        left: rect.right - 192,
      });
    }
    setDropdownOpen((o) => !o);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (dropdownRef.current && !dropdownRef.current.contains(target) && dropdownMenuRef.current && !dropdownMenuRef.current.contains(target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAction = async (index: number, action: () => void | Promise<void>) => {
    setLoading((prev) => new Set(prev).add(index));
    try {
      await Promise.resolve(action());
    } finally {
      setLoading((prev) => {
        const next = new Set(prev);
        next.delete(index);
        return next;
      });
      setDropdownOpen(false);
      setDrawerOpen(false);
    }
  };

  const renderButton = (item: MenuItem, idx: number) =>
    !item.hide && (
      <button
        key={idx}
        onClick={() => handleAction(idx, item.action as any)}
        className={`flex w-full items-center gap-2 px-4 py-3 md:py-2 text-left cursor-pointer hover:bg-primary hover:text-primary-foreground bg-foreground ${
          item.disabled ? "text-disabled! hover:bg-background-hover disabled:opacity-50" : ""
        }`}
        disabled={item.disabled}
      >
        <div className="mr-2">{loading.has(idx) ? <Spinner mode="light" /> : item.icon}</div>
        <div>{item.name}</div>
      </button>
    );

  return (
    <div>
      {/* Desktop */}
      <div className="hidden md:block relative" ref={dropdownRef}>
        <ButtonIcon
          onClick={(e: React.MouseEvent<HTMLElement>) => {
            e.stopPropagation();
            toggleDropdown();
          }}
        >
          <DotsThreeIcon size={ICON_SM} />
        </ButtonIcon>

        {isDropdownOpen &&
          createPortal(
            <div
              ref={dropdownMenuRef}
              className="fixed z-50 overflow-auto max-h-60 w-48 bg-foreground shadow-lg rounded-md"
              style={{
                top: dropdownPosition.top,
                left: dropdownPosition.left,
              }}
            >
              {items.map(renderButton)}
            </div>,
            document.body,
          )}
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <ButtonIcon onClick={() => setDrawerOpen(true)}>
          <DotsThreeIcon size={24} />
        </ButtonIcon>

        {createPortal(
          <>
            {isDrawerOpen && <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setDrawerOpen(false)} />}

            <div
              className={`fixed bottom-0 left-0 right-0 z-50 transform transition-transform duration-200 ${
                isDrawerOpen ? "translate-y-0" : "translate-y-full"
              }`}
            >
              <div className="bg-foreground rounded-t-xl max-h-60 overflow-auto">{items.map(renderButton)}</div>
            </div>
          </>,
          document.body,
        )}
      </div>
    </div>
  );
};

export default ActionMenu;
