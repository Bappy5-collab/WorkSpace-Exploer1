"use client";

import { useMemo, useState } from "react";
import { FolderOpen } from "lucide-react";
import { useWorkspace } from "@/store/workspaceStore";
import { ROOT_ID, countChildren, getChildren, getDescendantIds, sortItems } from "@/lib/tree";
import { FSItem } from "@/types";
import ItemRow from "./ItemRow";
import NameDialog from "@/components/ui/NameDialog";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function FolderContents() {
  const items = useWorkspace((s) => s.items);
  const selectedFolderId = useWorkspace((s) => s.selectedFolderId);
  const selectFolder = useWorkspace((s) => s.selectFolder);
  const openFile = useWorkspace((s) => s.openFile);
  const renameItem = useWorkspace((s) => s.renameItem);
  const deleteItem = useWorkspace((s) => s.deleteItem);
  const guard = useWorkspace((s) => s.guard);

  const [renaming, setRenaming] = useState<FSItem | null>(null);
  const [deleting, setDeleting] = useState<FSItem | null>(null);

  const children = useMemo(
    () => sortItems(getChildren(items, selectedFolderId)),
    [items, selectedFolderId]
  );
  const counts = useMemo(() => countChildren(items), [items]);

  const getDeleteMessage = (item: FSItem) => {
    const nested = getDescendantIds(items, item.id).length;
    if (nested === 0) return `"${item.name}" will be deleted permanently.`;
    return `"${item.name}" and the ${nested} ${nested === 1 ? "item" : "items"} inside it will be deleted permanently.`;
  };

  if (children.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 p-10 text-center">
        <FolderOpen size={36} className="text-slate-300" />
        <p className="text-sm font-medium">
          {selectedFolderId === ROOT_ID ? "Your workspace is empty" : "This folder is empty"}
        </p>
        <p className="text-sm text-slate-500">Create a new folder or file to get started.</p>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4">
      <ul className="divide-y divide-slate-100 rounded-md border border-slate-200">
        {children.map((item) => (
          <ItemRow
            key={item.id}
            item={item}
            childCount={counts[item.id] || 0}
            onOpen={() =>
              guard(() => (item.type === "folder" ? selectFolder(item.id) : openFile(item.id)))
            }
            onRename={() => setRenaming(item)}
            onDelete={() => setDeleting(item)}
          />
        ))}
      </ul>

      {renaming && (
        <NameDialog
          title={`Rename ${renaming.type}`}
          type={renaming.type}
          parentId={selectedFolderId}
          initialValue={renaming.name}
          excludeId={renaming.id}
          submitLabel="Rename"
          onSubmit={(name) => renameItem(renaming.id, name)}
          onClose={() => setRenaming(null)}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title={`Delete ${deleting.type}?`}
          message={getDeleteMessage(deleting)}
          confirmLabel="Delete"
          onConfirm={() => {
            deleteItem(deleting.id);
            setDeleting(null);
          }}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}