"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronRight,
  FilePlus,
  FolderPlus,
  MoreVertical,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { ItemType } from "@/types";

interface ItemMenuProps {
  name: string;
  onNew?: (type: ItemType) => void;
  onRename: () => void;
  onDelete: () => void;
}

export default function ItemMenu({
  name,
  onNew,
  onRename,
  onDelete,
}: ItemMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showNewMenu, setShowNewMenu] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setShowNewMenu(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setShowNewMenu(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const closeMenu = () => {
    setIsOpen(false);
    setShowNewMenu(false);
  };

  const handleAction = (action: () => void) => {
    closeMenu();
    action();
  };

  const menuItemClass =
    "flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-slate-100";

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-label={`Actions for ${name}`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => {
          setIsOpen((prev) => !prev);
          setShowNewMenu(false);
        }}
         className={`rounded p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 ${
          isOpen ? "bg-slate-200 text-slate-700" : ""
        }`}
      >
        <MoreVertical size={16} />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full z-20 mt-1 w-40 rounded-md border border-slate-200 bg-white py-1 shadow-lg"
        >
          {onNew&&(
            <div
            className="relative"
            onMouseEnter={() => setShowNewMenu(true)}
            onMouseLeave={() => setShowNewMenu(false)}
          >
            <button
              type="button"
              role="menuitem"
              onClick={() => setShowNewMenu(true)}
              className={menuItemClass}
            >
              <Plus size={15} />
              <span>New</span>
              <ChevronRight
                size={14}
                className="ml-auto text-slate-400"
              />
            </button>

            {showNewMenu && (
              <div
                role="menu"
                className="absolute right-full top-0 w-40 rounded-md border border-slate-200 bg-white py-1 shadow-lg"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => handleAction(() => onNew("folder"))}
                  className={menuItemClass}
                >
                  <FolderPlus size={15} />
                  <span>New folder</span>
                </button>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => handleAction(() => onNew("file"))}
                  className={menuItemClass}
                >
                  <FilePlus size={15} />
                  <span>New file</span>
                </button>
              </div>
            )}
          </div>
            )}
          <button
            type="button"
            role="menuitem"
            onClick={() => handleAction(onRename)}
            className={menuItemClass}
          >
            <Pencil size={15} />
            <span>Rename</span>
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={() => handleAction(onDelete)}
            className={`${menuItemClass} text-red-600 hover:bg-red-50`}
          >
            <Trash2 size={15} />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
}

