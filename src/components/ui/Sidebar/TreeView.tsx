"use client";

import { X } from "lucide-react";
import TreeNode from "./TreeNode";
import { ROOT_ID } from "@/lib/tree";

interface TreeViewProps {
  open: boolean;
  onClose: () => void;
}

export default function TreeView({ open, onClose }: TreeViewProps) {
  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/30 md:hidden" onClick={onClose} />}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-slate-50 transition-transform md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-12 items-center justify-between border-b border-slate-200 px-3">
          <span className="text-sm font-semibold">Explorer</span>
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded p-1 hover:bg-slate-200 md:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2">
          <ul>
            <TreeNode id={ROOT_ID} depth={0} onNavigate={onClose} />
          </ul>
        </nav>
      </aside>
    </>
  );
}