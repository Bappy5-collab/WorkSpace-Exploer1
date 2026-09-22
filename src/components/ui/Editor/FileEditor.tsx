"use client";

import { useState } from "react";
import { Pencil, Save, Trash2 } from "lucide-react";
import { selectIsDirty, useWorkspace } from "@/store/workspaceStore";
import { ROOT_ID } from "@/lib/tree";
import NameDialog from "@/components/ui/NameDialog";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function FileEditor() {
  const file = useWorkspace((s) => (s.openFileId ? s.items[s.openFileId] : undefined));
  const draft = useWorkspace((s) => s.draft);
  const isDirty = useWorkspace(selectIsDirty);
  const setDraft = useWorkspace((s) => s.setDraft);
  const saveFile = useWorkspace((s) => s.saveFile);
  const renameItem = useWorkspace((s) => s.renameItem);
  const deleteItem = useWorkspace((s) => s.deleteItem);

  const [renaming, setRenaming] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!file) return null;

  const iconBtn = "rounded-md border border-slate-300 p-2 text-slate-600 hover:bg-slate-50";

  return (
    <div className="flex h-full flex-col p-2 sm:p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold">{file.name}</h2>
          <p className={`text-xs ${isDirty ? "text-amber-600" : "text-slate-400"}`}>
            {isDirty ? "Unsaved changes" : `Saved ${new Date(file.updatedAt).toLocaleString()}`}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button onClick={() => setRenaming(true)} aria-label="Rename file" className={iconBtn}>
            <Pencil size={16} />
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            aria-label="Delete file"
            className={`${iconBtn} text-red-600 hover:bg-red-50`}
          >
            <Trash2 size={16} />
          </button>
          <button
            onClick={saveFile}
            disabled={!isDirty}
            className="flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-40"
          >
            <Save size={16} /> Save
          </button>
        </div>
      </div>

      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
            e.preventDefault();
            saveFile();
          }
        }}
        placeholder="Start typing..."
        className="min-h-64 flex-1 resize-none rounded-md border border-slate-300 p-3 font-mono text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
      />

      {renaming && (
        <NameDialog
          title="Rename file"
          type="file"
          parentId={file.parentId ?? ROOT_ID}
          initialValue={file.name}
          excludeId={file.id}
          submitLabel="Rename"
          onSubmit={(name) => renameItem(file.id, name)}
          onClose={() => setRenaming(false)}
        />
      )}

      {confirmDelete && (
        <ConfirmDialog
          title="Delete file?"
          message={
            isDirty
              ? `"${file.name}" will be deleted permanently, including your unsaved changes.`
              : `"${file.name}" will be deleted permanently.`
          }
          confirmLabel="Delete"
          onConfirm={() => {
            deleteItem(file.id);
            setConfirmDelete(false);
          }}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </div>
  );
}