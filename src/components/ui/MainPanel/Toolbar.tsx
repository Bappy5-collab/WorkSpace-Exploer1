"use client";

import { useState } from "react";
import { FilePlus, FolderPlus } from "lucide-react";
import { useWorkspace } from "@/store/workspaceStore";
import { ItemType } from "@/types";
import NameDialog from "@/components/ui/NameDialog";
import SearchBar from "@/components/Search/SearchBar";


interface ToolbarProps {
  query: string;
  onQueryChange: (value: string) => void;
  canCreate: boolean;
}

export default function Toolbar({ query, onQueryChange, canCreate }: ToolbarProps) {
  const selectedFolderId = useWorkspace((s) => s.selectedFolderId);
  const createItem = useWorkspace((s) => s.createItem);
  const [creating, setCreating] = useState<ItemType | null>(null);

  const btn =
    "flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50";

  return (
    <div className="flex flex-col gap-2 border-b border-slate-200 px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-2">
        {canCreate && (
          <>
            <button onClick={() => setCreating("folder")} className={btn}>
              <FolderPlus size={16} /> New folder
            </button>
            <button onClick={() => setCreating("file")} className={btn}>
              <FilePlus size={16} /> New file
            </button>
          </>
        )}
      </div>

      <SearchBar value={query} onChange={onQueryChange} />

      {creating && (
        <NameDialog
          title={creating === "folder" ? "New folder" : "New text file"}
          type={creating}
          parentId={selectedFolderId}
          submitLabel="Create"
          onSubmit={(name) => createItem(creating, name)}
          onClose={() => setCreating(null)}
        />
      )}
    </div>
  );
}