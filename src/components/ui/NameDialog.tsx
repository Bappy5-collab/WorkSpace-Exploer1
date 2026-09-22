"use client";

import { FormEvent, useState } from "react";
import Modal from "./Modal";
import { ItemType } from "@/types";
import { useWorkspace } from "@/store/workspaceStore";
import { normalizeName, validateName } from "@/lib/validation";

interface NameDialogProps {
  title: string;
  type: ItemType;
  parentId: string;
  initialValue?: string;
  excludeId?: string;
  submitLabel: string;
  onSubmit: (name: string) => void;
  onClose: () => void;
}

export default function NameDialog({
  title,
  type,
  parentId,
  initialValue = "",
  excludeId,
  submitLabel,
  onSubmit,
  onClose,
}: NameDialogProps) {
  const items = useWorkspace((s) => s.items);
  const [value, setValue] = useState(initialValue);
  const [touched, setTouched] = useState(false);

  const error = validateName(items, type, value, parentId, excludeId);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (error) return;
    onSubmit(normalizeName(type, value));
    onClose();
  };

  return (
    <Modal title={title} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <input
          autoFocus
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setTouched(true);
          }}
          onFocus={(e) => e.target.select()}
          placeholder={type === "folder" ? "Folder name" : "File name"}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
        <p className="mt-2 min-h-5 text-sm text-red-600">{touched && error}</p>
        <div className="mt-3 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-3 py-1.5 text-sm hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!!error}
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {submitLabel}
          </button>
        </div>
      </form>
    </Modal>
  );
}