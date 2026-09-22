# Mini Workspace Explorer

A browser-based file manager built with **Next.js, React, TypeScript and Zustand**. Users can create, browse, search, edit, rename and delete folders and text files. All data is stored in the browser (no backend).

## Live Demo

https://workspace-explorer-app.vercel.app/

## GitHub Repository

https://github.com/Bappy5-collab/WorkSpace-Exploer1

## Features

- Hierarchical workspace with unlimited folder nesting
- Recursive sidebar tree with expand/collapse and selected-folder highlight
- Clickable breadcrumb (e.g. `Workspace / Projects / Webbly / notes.txt`)
- Create folders and text files inside the selected folder
- Rename and delete both files and folders
- Recursive delete (a folder is deleted with all of its nested contents)
- Text file editor (`<textarea>`) with Save button and `Ctrl/Cmd + S`
- Workspace-wide search across all nested folders
- Validation for empty names, invalid characters and duplicate names
- Unsaved-changes protection (in-app dialog + browser refresh warning)
- Persistence with `localStorage`
- Responsive layout (sidebar becomes a slide-in drawer on small screens)

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Zustand (with `persist` middleware)
- Tailwind CSS v4
- lucide-react (icons)

## Getting Started

### Prerequisites

Node.js 20.9 or later.

### Installation

```bash
git clone https://github.com/Bappy5-collab/WorkSpace-Exploer1.git
cd WorkSpace-Exploer1
npm install
npm run dev
```

Open http://localhost:3000

### Available Scripts

| Command         | Description                   |
| --------------- | ----------------------------- |
| `npm run dev`   | Start the development server  |
| `npm run build` | Create a production build     |
| `npm run start` | Start the production server   |
| `npm run lint`  | Run ESLint                    |

## Project Structure

```text
src/
├── app/
│   ├── layout.tsx              # Root layout and page metadata
│   ├── page.tsx                # Main page: sidebar, header, toolbar, content area
│   └── globals.css
├── components/
│   ├── Search/
│   │   ├── SearchBar.tsx       # Search input with clear button
│   │   └── SearchResult.tsx    # Search results with location path and highlight
│   └── ui/
│       ├── Modal.tsx           # Reusable modal (closes on Escape or backdrop click)
│       ├── ConfirmDialog.tsx   # Delete confirmation
│       ├── NameDialog.tsx      # Create / rename dialog with live validation
│       ├── UnsavedDialog.tsx   # Save / Discard / Keep editing dialog
│       ├── Editor/
│       │   └── FileEditor.tsx  # Text file editor with save, rename and delete
│       ├── MainPanel/
│       │   ├── Breadcrumb.tsx
│       │   ├── Toolbar.tsx     # New folder/file, rename/delete current folder, search
│       │   ├── FolderContents.tsx
│       │   ├── ItemRow.tsx
│       │   └── ItemMenu.tsx    # Per-item menu: New, Rename, Delete
│       └── Sidebar/
│           ├── TreeView.tsx
│           └── TreeNode.tsx    # Recursive tree node
├── lib/
│   ├── tree.ts                 # Tree helpers: children, path, descendants, sort, search
│   ├── validation.ts           # Name normalization and validation
│   └── useDebounce.ts          # Debounce hook for search
├── store/
│   └── workspaceStore.ts       # Zustand store (state, actions, persistence)
└── types/
    └── index.ts                # FSItem and ItemsMap types
```

## State Management

All workspace state lives in a single **Zustand** store (`src/store/workspaceStore.ts`). Components subscribe only to the slices they need, so the sidebar, breadcrumb, main panel, editor and search always stay in sync.

The store holds:

| State              | Purpose                                              |
| ------------------ | ---------------------------------------------------- |
| `items`            | All files and folders (flat map, see below)          |
| `selectedFolderId` | Folder shown in the main panel                       |
| `openFileId`       | File currently open in the editor (or `null`)        |
| `expandedIds`      | Expanded folders in the sidebar tree                 |
| `draft`            | Editor text that is not saved yet                    |
| `pendingAction`    | Navigation waiting for the unsaved-changes dialog    |

Actions: `selectFolder`, `openFile`, `revealItem`, `toggleExpand`, `createItem`, `renameItem`, `deleteItem`, `setDraft`, `saveFile`, `guard`, `resolvePending`.

**Persistence** uses Zustand's `persist` middleware with `localStorage` (key: `workspace-explorer-v1`).

- Persisted: `items` (including file contents), `selectedFolderId`, `expandedIds`.
- Not persisted: `openFileId`, `draft`, `pendingAction` (these are session-only UI state).
- A custom `merge` checks the saved data on load. If it is missing or invalid (no root folder), the default workspace is used. A saved selected folder or expanded id that no longer exists is dropped.
- Because `localStorage` exists only in the browser, the page renders a short loading state until it is mounted on the client. This avoids a server/client hydration mismatch.

## File-System Data Structure

Each item follows this shape (`src/types/index.ts`):

```ts
interface FSItem {
  id: string;
  name: string;
  type: "folder" | "file";
  parentId: string | null; // null only for the root "Workspace" folder
  content?: string;        // text content, files only
  createdAt: number;
  updatedAt: number;
}

type ItemsMap = Record<string, FSItem>;
```

Items are stored in a **flat, normalized map keyed by id**, not as a nested tree. The hierarchy comes from `parentId`.

Why a flat map:

- Lookup, rename and save by id are O(1) and need no deep tree cloning.
- Moving through the hierarchy is done by helpers in `src/lib/tree.ts`: `getChildren`, `getPath` (for the breadcrumb), `getDescendantIds` (for recursive delete) and `searchItems`.
- It serializes directly to `localStorage`.
- Nesting depth is unlimited because every item only points to its parent.

The root folder has the fixed id `"root"`. The default workspace is:

```text
Workspace
├── Projects
│   ├── Webbly
│   │   ├── notes.txt
│   │   └── tasks.txt
│   └── Personal
├── Documents
└── README.txt
```

## Important Implementation Decisions

### Navigation

- The sidebar shows **folders only**. Files are listed in the main panel, where they can be opened.
- Selecting a folder also expands it in the sidebar.
- Opening a file also selects its parent folder, so the breadcrumb shows where the file is.
- Items are sorted with folders first, then by name in natural order (`file2` comes before `file10`).

### Create

- New items are created inside the currently selected folder using the **New folder** and **New file** toolbar buttons. These buttons are hidden while a file is open or a search is active.
- The item menu of a folder also has a **New** option. It creates the item inside that subfolder and then **navigates to that folder**, so the new item is visible and the folder becomes the selected folder.

### Validation

Names are checked live in the create/rename dialog (`src/lib/validation.ts`):

- Leading and trailing spaces are trimmed. An empty name is rejected.
- The name can be at most 100 characters and cannot contain `/` or `\`.
- Duplicate names in the same folder are rejected. The check is **case-insensitive** (`Notes.txt` and `notes.txt` count as the same).
- A file name automatically gets a `.txt` extension if it does not already have one. A name that is only `.txt` is treated as empty.

### Rename

- Files and folders can be renamed from the item menu.
- The current folder can be renamed from the toolbar.
- The open file can be renamed from the editor. Renaming does not affect unsaved text in the editor.
- The root `Workspace` folder cannot be renamed or deleted.

### Delete

- Every delete asks for confirmation. For folders, the message shows how many nested items will also be deleted.
- Deleting a folder removes it and all of its descendants.
- If the selected folder (or one of its ancestors) is deleted, the app navigates to the **parent of the deleted folder**.
- If the open file is deleted (directly or with its folder), the editor closes. Deleted folders are also removed from the expanded list.
- The open file can be deleted from the editor. If it has unsaved changes, the confirmation message says they will be lost.

### Text Editor and Unsaved Changes

- Editor text is kept in a separate `draft`. The file's `content` is updated only on **Save** (button or `Ctrl/Cmd + S`). Leaving a file and coming back shows the saved content.
- Any navigation away from a file with unsaved changes goes through `guard()`. This includes the sidebar, breadcrumb, folder list and search results. It opens a dialog with three options: **Keep editing**, **Discard** and **Save and continue**.
- Refreshing or closing the tab with unsaved changes triggers the browser's `beforeunload` warning.

### Search

- Search covers the **whole workspace**, including deeply nested folders. It matches item names and is case-insensitive.
- The input is debounced (200 ms). Each result shows its location path and highlights the matching text.
- Clicking a result expands all its parent folders in the sidebar. A folder result opens the folder, and a file result opens the file in the editor.

### Empty States

- An empty folder shows "This folder is empty".
- An empty root shows "Your workspace is empty". The New folder and New file buttons are still available.
- A search with no matches shows a "No results" message.

### Responsive UI

On screens smaller than `md`, the sidebar becomes a slide-in drawer. It opens from the header menu button and closes after you navigate. The toolbar buttons wrap on narrow screens.

## Edge Cases Handled

| Edge case                        | Handling                                                  |
| -------------------------------- | --------------------------------------------------------- |
| Duplicate file/folder names      | Blocked per folder, case-insensitive                      |
| Empty folders                    | Empty-state message                                       |
| Deleting a folder with contents  | Recursive delete, with nested item count in confirmation  |
| Deleting the selected folder     | Navigates to the parent folder                            |
| Searching deeply nested files    | Whole-workspace search, reveals path on click             |
| Unsaved text-file changes        | Guard dialog + browser refresh warning                    |
| Empty workspace                  | Root cannot be deleted, empty-state message shown         |
| Missing or invalid saved data    | Falls back to the default workspace                       |