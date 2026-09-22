import { ItemType, ItemsMap } from "@/types";
import { getChildren } from "./tree";

const MAX_LENGTH = 100;

export function normalizeName(type: ItemType, rawName: string) {
  const name = rawName.trim();
  if (type === "file" && name && !name.toLowerCase().endsWith(".txt")) {
    return name + ".txt";
  }
  return name;
}

export function validateName(
  items: ItemsMap,
  type: ItemType,
  rawName: string,
  parentId: string,
  excludeId?: string
) {
  const name = rawName.trim();

  if (!name || name.toLowerCase() === ".txt") {
    return "Name can't be empty.";
  }
  if (name.length > MAX_LENGTH) {
    return `Name can't be longer than ${MAX_LENGTH} characters.`;
  }
  if (name.includes("/") || name.includes("\\")) {
    return "Name can't contain / or \\.";
  }

  const finalName = normalizeName(type, name);
  const duplicate = getChildren(items, parentId).some(
    (child) =>
      child.id !== excludeId && child.name.toLowerCase() === finalName.toLowerCase()
  );
  if (duplicate) {
    return `"${finalName}" already exists in this folder.`;
  }

  return null;
}