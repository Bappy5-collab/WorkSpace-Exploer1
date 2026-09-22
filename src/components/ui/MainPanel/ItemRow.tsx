"use client";

import { File, Folder } from "lucide-react";
import { FSItem, ItemType } from "@/types";
import ItemMenu from "./ItemMenu";

interface ItemRowProps {
  item: FSItem;
  childCount: number;
  onOpen: () => void;
  onNew: (type: ItemType) => void;
  onRename: () => void;
  onDelete: () => void;
}

export default function ItemRow({
  item,
  childCount,
  onOpen,
  onNew,
  onRename,
  onDelete,
}: ItemRowProps) {
  const isFolder = item.type === "folder";

  const updatedDate = new Date(item.updatedAt).toLocaleDateString();

  return (
    <li className="group flex items-center hover:bg-slate-50">
      <button
        type="button"
        onClick={onOpen}
        className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2.5 text-left"
      >
        {isFolder ? (
          <Folder
            size={18}
            className="shrink-0 text-amber-500"
          />
        ) : (
          <File
            size={18}
            className="shrink-0 text-slate-400"
          />
        )}

        <span className="truncate text-sm">
          {item.name}
        </span>

        <span className="ml-auto shrink-0 text-xs text-slate-400">
          {isFolder
            ? `${childCount} ${childCount === 1 ? "item" : "items"}`
            : updatedDate}
        </span>
      </button>

      <div className="shrink-0 pr-2">
        <ItemMenu
          name={item.name}
          onNew={isFolder ? onNew : undefined}
          onRename={onRename}
          onDelete={onDelete}
        />
      </div>
    </li>
  );
}

