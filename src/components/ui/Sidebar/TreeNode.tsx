"use client";

import { useMemo } from "react";
import { ChevronRight, Folder, FolderOpen } from "lucide-react";
import { useWorkspace } from "@/store/workspaceStore";
import { getChildren, sortItems } from "@/lib/tree";

interface TreeNodeProps {
  id: string;
  depth: number;
  onNavigate?: () => void;
}

export default function TreeNode({ id, depth, onNavigate }: TreeNodeProps) {
  const items = useWorkspace((s) => s.items);
  const selectedFolderId = useWorkspace((s) => s.selectedFolderId);
  const expandedIds = useWorkspace((s) => s.expandedIds);
  const toggleExpand = useWorkspace((s) => s.toggleExpand);
  const selectFolder = useWorkspace((s) => s.selectFolder);
  const guard = useWorkspace((s) => s.guard);

  const folder = items[id];
  const subFolders = useMemo(
    () => sortItems(getChildren(items, id).filter((c) => c.type === "folder")),
    [items, id]
  );

  if (!folder) return null;

  const isExpanded = expandedIds.includes(id);
  const isSelected = selectedFolderId === id;

  return (
    <li>
      <div
        className={`flex items-center rounded-md pr-2 text-sm ${
          isSelected ? "bg-indigo-100 text-indigo-900" : "hover:bg-slate-200/60"
        }`}
        style={{ paddingLeft: depth * 14 + 4 }}
      >
        <button
          onClick={() => toggleExpand(id)}
          aria-label={isExpanded ? "Collapse folder" : "Expand folder"}
          className={`flex h-6 w-6 shrink-0 items-center justify-center ${
            subFolders.length === 0 ? "invisible" : ""
          }`}
        >
          <ChevronRight size={14} className={isExpanded ? "rotate-90" : ""} />
        </button>

        <button
          onClick={() =>
            guard(() => {
              selectFolder(id);
              onNavigate?.();
            })
          }
          className="flex min-w-0 flex-1 items-center gap-2 py-1.5 text-left"
        >
          {isExpanded ? (
            <FolderOpen size={16} className="shrink-0 text-amber-500" />
          ) : (
            <Folder size={16} className="shrink-0 text-amber-500" />
          )}
          <span className="truncate">{folder.name}</span>
        </button>
      </div>

      {isExpanded && subFolders.length > 0 && (
        <ul>
          {subFolders.map((sub) => (
            <TreeNode key={sub.id} id={sub.id} depth={depth + 1} onNavigate={onNavigate} />
          ))}
        </ul>
      )}
    </li>
  );
}