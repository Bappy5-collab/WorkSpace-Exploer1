"use client";

import { useState } from "react";
import { FilePlus, FolderPlus, Pencil, Trash2 } from "lucide-react";
import { useWorkspace } from "@/store/workspaceStore";
import { ItemType } from "@/types";
import NameDialog from "@/components/ui/NameDialog";
import SearchBar from "@/components/Search/SearchBar";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { ROOT_ID, getDescendantIds } from "@/lib/tree";

interface ToolbarProps {
  query: string;
  onQueryChange: (value: string) => void;
  canCreate: boolean;
}

export default function Toolbar({ query, onQueryChange, canCreate }: ToolbarProps) {
  const items = useWorkspace((s) => s.items);
  const selectedFolderId = useWorkspace((s) => s.selectedFolderId);
  const createItem = useWorkspace((s) => s.createItem);
  const renameItem = useWorkspace((s) => s.renameItem);
  const deleteItem = useWorkspace((s) => s.deleteItem);

  const [creating, setCreating] = useState<ItemType | null>(null);
  const [renaming, setRenaming] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const folder = items[selectedFolderId];
  const canEditFolder = canCreate && selectedFolderId !== ROOT_ID;
  const nested = confirmDelete ? getDescendantIds(items, selectedFolderId).length : 0;
  const btn =
    "flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50";

  return (
    <div className="flex flex-col gap-2 border-b border-slate-200 px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
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
        {canEditFolder && (
          <>
            <button onClick={() => setRenaming(true)} className={btn}>
              <Pencil size={16} /> Rename folder
            </button>
            <button onClick={() => setConfirmDelete(true)} className={`${btn} text-red-600`}>
              <Trash2 size={16} /> Delete folder
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

      {renaming && folder && (
        <NameDialog
          title="Rename folder"
          type="folder"
          parentId={folder.parentId ?? ROOT_ID}
          initialValue={folder.name}
          excludeId={folder.id}
          submitLabel="Rename"
          onSubmit={(name) => renameItem(folder.id, name)}
          onClose={() => setRenaming(false)}
        />
      )}

      {confirmDelete && folder && (
        <ConfirmDialog
          title="Delete folder?"
          message={
            nested === 0
              ? `"${folder.name}" will be deleted permanently.`
              : `"${folder.name}" and the ${nested} ${nested === 1 ? "item" : "items"} inside it will be deleted permanently.`
          }
          confirmLabel="Delete"
          onConfirm={() => {
            deleteItem(selectedFolderId);
            setConfirmDelete(false);
          }}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </div>
  );
}