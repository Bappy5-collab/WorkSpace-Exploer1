# Mini Workspace Explorer

A browser based Mini Workspace Explorer built with Next.js, TypeScript and Zustand. The Mini Workspace Explorer provides a file manager interface for creating, browsing, searching, editing, renaming and deleting folders and text files.

## Live Demo

https://workspace-explorer-app.vercel.app/

## GitHub Repository

https://github.com/Bappy5-collab/WorkSpace-Exploer1

## Features

* Hierarchical file and folder structure

* Recursive sidebar tree navigation

* Expand/collapse folders

* Folder selection and navigation

* Breadcrumb navigation

* Create folders and text files

* Rename. Folders

* Delete. Folders

* Recursive folder deletion

* Text file editor

* Save file content

* Workspace- search

* Search across deeply nested folders

* Duplicate-name validation

* Empty-name validation

* Unsaved changes confirmation

* modal and dialog components

* Persistence using browser storage

* Responsive workspace interface

## Tech Stack

* Next.js

* React

* TypeScript

* Zustand

* CSS, TailwindCSS

* Browser localStorage for persistence

## Getting Started

### Prerequisites

Make sure you have Node.js installed.

### Installation

Clone the repository:

```bash

git clone https://github.com/Bappy5-collab/WorkSpace-Exploer1.git

```

Navigate into the project:

```bash

cd WorkSpace-Exploer1

```

Install dependencies:

```bash

npm install

```

Start the development server:

```bash

npm run dev

```

Open:

```text

http://localhost:3000

```

## Project Structure

```text

src/

├── components/

│   ├── ui/

│   │   ├── Modal.tsx

│   │   ├── ConfirmDialog.tsx

│   │   ├── NameDialog.tsx

│   │   └── UnsavedDialog.tsx
|

│   │

│   ├── Sidebar/

│   │   ├── TreeView.tsx

│   │   └── TreeNode.tsx

│   │

│   ├── MainPanel/

│   │   ├── Breadcrumb.tsx

│   │   ├── ItemRow.tsx

│   │   ├── FolderContents.tsx

│   │   └── Toolbar.tsx

│   │

│   ├── Editor/

│   │   └─ FileEditor.tsx

│   │

│   └── Search/

│       ├── SearchBar.tsx

│       └── SearchResults.tsx

│

├── store/

├── types/

├── utils/

└── app/

```

## State Management

The Mini Workspace Explorer uses Zustand for centralized workspace state management.

The store manages:

* Workspace items

* Selected folder

* Expanded folders

* File contents

* Create operations

* Rename operations

* Delete operations

* Navigation state

* Persistence-related state

Keeping workspace state in a store allows the sidebar, main panel, editor and search features of the Mini Workspace Explorer to stay synchronized.

## File-System Data Structure

Workspace items of the Mini Workspace Explorer are represented using a data model.

Each item contains information such as:

```ts

{

id: string;

name: string;

type: "folder" | "file";

parentId: string, | null;

}

```

Files of the Mini Workspace Explorer additionally maintain their text content.

The `parentId` relationship of the Mini Workspace Explorer allows support of nesting levels.

Example:

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

### Recursive Tree Navigation

The sidebar tree of the Mini Workspace Explorer is implemented recursively so folders can be nested at any depth.

### Folder Deletion

Deleting a folder of the Mini Workspace Explorer also removes all files and folders.

### Navigation After Deletion

If the selected folder of the Mini Workspace Explorer is deleted the Mini Workspace Explorer navigates to an appropriate parent folder.

### Validation

The Mini Workspace Explorer prevents names, empty names and unsaved changes without confirmation.

* Empty. Folder names

* Duplicate names within the parent folder

### Search

Search runs across the whole workspace instead of just the folder that is currently open. You can click results from deep folders to jump straight to where they are, in the workspace.

### Unsaved Changes

When you try to exit a file that has unsaved changes the application shows a confirmation dialog before it throws those changes away.

### Persistence

Workspace changes and file contents are saved in browser storage so the data stays there even after you refresh the page.

## Available Scripts

Run the development server:

```bash

npm run dev

```

Create a production build:

```bash

npm run build

```

Start the production server:

```bash

npm run start

```

Run linting:

```bash

npm run lint

```

## Deployment

The application's deployed using Vercel.

Live application:

https://workspace-explorer-app.vercel.app/

## Assessment Scope

This project does what the Webbly Media Mini Workspace Explorer assessment asks for. It covers workspace navigation, file and folder management text editing, search, persistence, validation, an UI and handling of edge cases.