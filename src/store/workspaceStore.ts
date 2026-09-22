import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FSItem, ItemType, ItemsMap } from "@/types";
import { ROOT_ID, getDescendantIds, getPath } from "@/lib/tree";

function seed(
  id: string,
  name: string,
  type: ItemType,
  parentId: string | null,
  content = ""
): FSItem {
  const time = Date.now();
  const item: FSItem = { id, name, type, parentId, createdAt: time, updatedAt: time };
  if (type === "file") item.content = content;
  return item;
}

const initialItems: ItemsMap = {};
[
  seed(ROOT_ID, "Workspace", "folder", null),
  seed("projects", "Projects", "folder", ROOT_ID),
  seed("webbly", "Webbly", "folder", "projects"),
  seed("notes", "notes.txt", "file", "webbly", "Kickoff notes\n- set up repo\n- build the explorer"),
  seed("tasks", "tasks.txt", "file", "webbly", "[ ] tree view\n[ ] editor\n[ ] search"),
  seed("personal", "Personal", "folder", "projects"),
  seed("documents", "Documents", "folder", ROOT_ID),
  seed("readme", "README.txt", "file", ROOT_ID, "Welcome to the workspace explorer."),
].forEach((item) => {
  initialItems[item.id] = item;
});

interface WorkspaceState {
  items: ItemsMap;
  selectedFolderId: string;
  openFileId: string | null;
  expandedIds: string[];

  draft: string;
  pendingAction: (() => void) | null;

  selectFolder: (id: string) => void;
  openFile: (id: string) => void;
  revealItem: (id: string) => void;
  toggleExpand: (id: string) => void;

    createItem: (type: ItemType, name: string, parentId?: string) => void;
  renameItem: (id: string, name: string) => void;
  deleteItem: (id: string) => void;

  setDraft: (value: string) => void;
  saveFile: () => void;

  guard: (action: () => void) => void;
  resolvePending: (choice: "save" | "discard" | "cancel") => void;
}

export const selectIsDirty = (state: WorkspaceState) =>
  state.openFileId !== null && state.items[state.openFileId]?.content !== state.draft;

const addIds = (list: string[], ...ids: string[]) => Array.from(new Set([...list, ...ids]));

export const useWorkspace = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      items: initialItems,
      selectedFolderId: ROOT_ID,
      openFileId: null,
      expandedIds: [ROOT_ID, "projects"],
      draft: "",
      pendingAction: null,

      selectFolder: (id) =>
        set((state) => ({
          selectedFolderId: id,
          openFileId: null,
          draft: "",
          expandedIds: addIds(state.expandedIds, id),
        })),

      openFile: (id) =>
        set((state) => {
          const file = state.items[id];
          if (!file || file.type !== "file") return state;
          return {
            openFileId: id,
            selectedFolderId: file.parentId ?? ROOT_ID,
            draft: file.content ?? "",
          };
        }),

      revealItem: (id) => {
        const { items, selectFolder, openFile } = get();
        const item = items[id];
        if (!item) return;

        const parentIds = getPath(items, id)
          .slice(0, -1)
          .map((p) => p.id);
        set((state) => ({ expandedIds: addIds(state.expandedIds, ...parentIds) }));

        if (item.type === "folder") selectFolder(id);
        else openFile(id);
      },

      toggleExpand: (id) =>
        set((state) => ({
          expandedIds: state.expandedIds.includes(id)
            ? state.expandedIds.filter((x) => x !== id)
            : [...state.expandedIds, id],
        })),

      createItem: (type, name, parentId) =>
        set((state) => {
          const id = crypto.randomUUID();
          const time = Date.now();
          const newItem: FSItem = {
            id,
            name,
            type,
            parentId: parentId ?? state.selectedFolderId,
            createdAt: time,
            updatedAt: time,
          };
          if (type === "file") newItem.content = "";
          return { items: { ...state.items, [id]: newItem } };
        }),

      renameItem: (id, name) =>
        set((state) => {
          const item = state.items[id];
          if (!item || id === ROOT_ID) return state;
          return {
            items: { ...state.items, [id]: { ...item, name, updatedAt: Date.now() } },
          };
        }),

      deleteItem: (id) =>
        set((state) => {
          const target = state.items[id];
          if (!target || id === ROOT_ID) return state;

          const idsToDelete = [id, ...getDescendantIds(state.items, id)];
          const items = { ...state.items };
          idsToDelete.forEach((x) => delete items[x]);

          const folderDeleted = idsToDelete.includes(state.selectedFolderId);
          const fileDeleted = state.openFileId !== null && idsToDelete.includes(state.openFileId);

          return {
            items,
            selectedFolderId: folderDeleted ? (target.parentId ?? ROOT_ID) : state.selectedFolderId,
            openFileId: fileDeleted ? null : state.openFileId,
            draft: fileDeleted ? "" : state.draft,
            expandedIds: state.expandedIds.filter((x) => !idsToDelete.includes(x)),
          };
        }),

      setDraft: (value) => set({ draft: value }),

      saveFile: () =>
        set((state) => {
          const { openFileId, items, draft } = state;
          if (!openFileId || !items[openFileId]) return state;
          return {
            items: {
              ...items,
              [openFileId]: { ...items[openFileId], content: draft, updatedAt: Date.now() },
            },
          };
        }),

      guard: (action) => {
        if (selectIsDirty(get())) set({ pendingAction: action });
        else action();
      },

      resolvePending: (choice) => {
        const { pendingAction, saveFile } = get();
        set({ pendingAction: null });
        if (choice === "cancel" || !pendingAction) return;
        if (choice === "save") saveFile();
        pendingAction();
      },
    }),
    {
      name: "workspace-explorer-v1",
      version: 1,
      partialize: (state) => ({
        items: state.items,
        selectedFolderId: state.selectedFolderId,
        expandedIds: state.expandedIds,
      }),
      merge: (persisted, current) => {
        const saved = persisted as Partial<WorkspaceState> | undefined;
        const items = saved?.items;
        if (!items || typeof items !== "object" || !items[ROOT_ID]) return current;

        const folderId = saved.selectedFolderId;
        return {
          ...current,
          items,
          selectedFolderId: folderId && items[folderId] ? folderId : ROOT_ID,
          expandedIds: (saved.expandedIds ?? []).filter((id) => items[id]),
        };
      },
    }
  )
);