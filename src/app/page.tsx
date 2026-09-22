"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Menu } from "lucide-react";
import { selectIsDirty, useWorkspace } from "@/store/workspaceStore";
import { useDebounce } from "@/lib/useDebounce";
import UnsavedDialog from "@/components/ui/UnsavedDialog";
import TreeView from "@/components/ui/Sidebar/TreeView";
import Breadcrumb from "@/components/ui/MainPanel/Breadcrumb";
import Toolbar from "@/components/ui/MainPanel/Toolbar";
import SearchResults from "@/components/Search/SearchResult";
import FileEditor from "@/components/ui/Editor/FileEditor";
import FolderContents from "@/components/ui/MainPanel/FolderContents";

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export default function Home() {
  const openFileId = useWorkspace((s) => s.openFileId);
  const isDirty = useWorkspace(selectIsDirty);

  const mounted = useMounted();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 200);

  const isSearching = query.trim() !== "" && debouncedQuery.trim() !== "";

  useEffect(() => {
    if (!isDirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [isDirty]);

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-slate-400">
        Loading workspace...
      </div>
    );
  }

  return (
    <div className="flex h-screen text-slate-900">
      <TreeView open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-12 items-center gap-2 border-b border-slate-200 px-3">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
            className="rounded p-1.5 hover:bg-slate-100 md:hidden"
          >
            <Menu size={20} />
          </button>
          <Breadcrumb />
        </header>

        <Toolbar query={query} onQueryChange={setQuery} canCreate={!openFileId && !isSearching} />

        <div className="min-h-0 flex-1 overflow-y-auto">
          {isSearching ? (
            <SearchResults query={debouncedQuery} onPick={() => setQuery("")} />
          ) : openFileId ? (
            <FileEditor />
          ) : (
            <FolderContents />
          )}
        </div>
      </main>

      <UnsavedDialog />
    </div>
  );
}