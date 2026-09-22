"use client";

import { useMemo } from "react";
import { File, Folder } from "lucide-react";
import { useWorkspace } from "@/store/workspaceStore";
import { getPath, searchItems } from "@/lib/tree";

interface SearchResultsProps {
  query: string;
  onPick: () => void;
}

function Highlight({ text, query }: { text: string; query: string }) {
  const start = text.toLowerCase().indexOf(query.trim().toLowerCase());
  if (start === -1) return <>{text}</>;
  const end = start + query.trim().length;

  return (
    <>
      {text.slice(0, start)}
      <mark className="bg-yellow-200">{text.slice(start, end)}</mark>
      {text.slice(end)}
    </>
  );
}

export default function SearchResults({ query, onPick }: SearchResultsProps) {
  const items = useWorkspace((s) => s.items);
  const revealItem = useWorkspace((s) => s.revealItem);
  const guard = useWorkspace((s) => s.guard);

  const results = useMemo(() => searchItems(items, query), [items, query]);

  if (results.length === 0) {
    return <p className="p-10 text-center text-sm text-slate-500">No results for &quot;{query.trim()}&quot;</p>;
  }

  return (
    <div className="p-2 sm:p-4">
      <p className="mb-2 px-2 text-sm text-slate-500">
        {results.length} {results.length === 1 ? "result" : "results"}
      </p>
      <ul className="divide-y divide-slate-100 rounded-md border border-slate-200">
        {results.map((item) => {
          const location = getPath(items, item.parentId ?? item.id)
            .map((p) => p.name)
            .join(" / ");

          return (
            <li key={item.id}>
              <button
                onClick={() =>
                  guard(() => {
                    revealItem(item.id);
                    onPick();
                  })
                }
                className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-slate-50"
              >
                {item.type === "folder" ? (
                  <Folder size={18} className="shrink-0 text-amber-500" />
                ) : (
                  <File size={18} className="shrink-0 text-slate-400" />
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm">
                    <Highlight text={item.name} query={query} />
                  </p>
                  <p className="truncate text-xs text-slate-500">{location}</p>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}