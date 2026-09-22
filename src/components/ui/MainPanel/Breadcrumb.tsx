"use client";

import { Fragment, useMemo } from "react";
import { ChevronRight } from "lucide-react";
import { useWorkspace } from "@/store/workspaceStore";
import { getPath } from "@/lib/tree";

export default function Breadcrumb() {
  const items = useWorkspace((s) => s.items);
  const selectedFolderId = useWorkspace((s) => s.selectedFolderId);
  const openFileId = useWorkspace((s) => s.openFileId);
  const selectFolder = useWorkspace((s) => s.selectFolder);
  const guard = useWorkspace((s) => s.guard);

  const path = useMemo(
    () => getPath(items, openFileId ?? selectedFolderId),
    [items, openFileId, selectedFolderId]
  );

  return (
    <nav className="min-w-0 flex-1 overflow-x-auto">
      <div className="flex items-center gap-1 whitespace-nowrap text-sm">
        {path.map((item, index) => {
          const isLast = index === path.length - 1;
          return (
            <Fragment key={item.id}>
              {isLast ? (
                <span className="font-medium">{item.name}</span>
              ) : (
                <>
                  <button
                    onClick={() => guard(() => selectFolder(item.id))}
                    className="rounded px-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                  >
                    {item.name}
                  </button>
                  <ChevronRight size={14} className="text-slate-300" />
                </>
              )}
            </Fragment>
          );
        })}
      </div>
    </nav>
  );
}