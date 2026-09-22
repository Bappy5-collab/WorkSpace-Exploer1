import { FSItem, ItemsMap } from "@/types";

export const ROOT_ID = "root";

export function getChildren(items: ItemsMap, parentId: string) {
  return Object.values(items).filter((item) => item.parentId === parentId);
}

export function sortItems(list: FSItem[]) {
  return [...list].sort((a, b) => {
    if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
    return a.name.localeCompare(b.name, undefined, { numeric: true });
  });
}

export function getDescendantIds(items: ItemsMap, id: string): string[] {
  const ids: string[] = [];
  for (const child of getChildren(items, id)) {
    ids.push(child.id);
    ids.push(...getDescendantIds(items, child.id));
  }
  return ids;
}

export function getPath(items: ItemsMap, id: string) {
  const path: FSItem[] = [];
  let current: FSItem | undefined = items[id];
  while (current) {
    path.unshift(current);
    current = current.parentId ? items[current.parentId] : undefined;
  }
  return path;
}

export function countChildren(items: ItemsMap) {
  const counts: Record<string, number> = {};
  Object.values(items).forEach((item) => {
    if (item.parentId) {
      counts[item.parentId] = (counts[item.parentId] || 0) + 1;
    }
  });
  return counts;
}

export function searchItems(items: ItemsMap, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const found = Object.values(items).filter(
    (item) => item.id !== ROOT_ID && item.name.toLowerCase().includes(q)
  );
  return sortItems(found);
}