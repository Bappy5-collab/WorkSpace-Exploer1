"use client";

import Modal from "./Modal";
import { useWorkspace } from "@/store/workspaceStore";

export default function UnsavedDialog() {
  const pendingAction = useWorkspace((s) => s.pendingAction);
  const resolvePending = useWorkspace((s) => s.resolvePending);

  if (!pendingAction) return null;

  return (
    <Modal title="Unsaved changes" onClose={() => resolvePending("cancel")}>
      <p className="text-sm text-slate-600">
        You have changes in this file that are not saved yet.
      </p>
      <div className="mt-5 flex flex-wrap justify-end gap-2">
        <button
          onClick={() => resolvePending("cancel")}
          className="rounded-md px-3 py-1.5 text-sm hover:bg-slate-100"
        >
          Keep editing
        </button>
        <button
          onClick={() => resolvePending("discard")}
          className="rounded-md px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
        >
          Discard
        </button>
        <button
          autoFocus
          onClick={() => resolvePending("save")}
          className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Save and continue
        </button>
      </div>
    </Modal>
  );
}