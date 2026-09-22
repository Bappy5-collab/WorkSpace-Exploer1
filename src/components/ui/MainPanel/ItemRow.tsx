"use client";

import { File, Folder, Pencil, Trash2 } from "lucide-react";
import { FSItem } from "@/types";

interface ItemRowProps {
  item: FSItem;
  childCount: number;
  onOpen: () => void;
  onRename: () => void;
  onDelete: () => void;
}

export default function ItemRow({ item, childCount, onOpen, onRename, onDelete }: ItemRowProps) {
  const isFolder = item.type === "folder";

  return (
    <li className="flex items-center hover:bg-slate-50">
      <button onClick={onOpen} className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2.5 text-left">
        {isFolder ? (
          <Folder size={18} className="shrink-0 text-amber-500" />
        ) : (
          <File size={18} className="shrink-0 text-slate-400" />
        )}
        <span className="truncate text-sm">{item.name}</span>
        <span className="ml-auto shrink-0 text-xs text-slate-400">
          {isFolder
            ? `${childCount} ${childCount === 1 ? "item" : "items"}`
            : new Date(item.updatedAt).toLocaleDateString()}
        </span>
      </button>

      <div className="flex shrink-0 pr-2">
        <button
          onClick={onRename}
          aria-label={`Rename ${item.name}`}
          className="rounded p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
        >
          <Pencil size={15} />
        </button>
        <button
          onClick={onDelete}
          aria-label={`Delete ${item.name}`}
          className="rounded p-2 text-slate-400 hover:bg-red-100 hover:text-red-600"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </li>
  );
}