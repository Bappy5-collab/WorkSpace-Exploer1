"use client";

import { Save } from "lucide-react";
import { selectIsDirty, useWorkspace } from "@/store/workspaceStore";

export default function FileEditor() {
  const file = useWorkspace((s) => (s.openFileId ? s.items[s.openFileId] : undefined));
  const draft = useWorkspace((s) => s.draft);
  const isDirty = useWorkspace(selectIsDirty);
  const setDraft = useWorkspace((s) => s.setDraft);
  const saveFile = useWorkspace((s) => s.saveFile);

  if (!file) return null;

  return (
    <div className="flex h-full flex-col p-2 sm:p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold">{file.name}</h2>
          <p className={`text-xs ${isDirty ? "text-amber-600" : "text-slate-400"}`}>
            {isDirty ? "Unsaved changes" : `Saved ${new Date(file.updatedAt).toLocaleString()}`}
          </p>
        </div>
        <button
          onClick={saveFile}
          disabled={!isDirty}
          className="flex shrink-0 items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-40"
        >
          <Save size={16} /> Save
        </button>
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
    </div>
  );
}