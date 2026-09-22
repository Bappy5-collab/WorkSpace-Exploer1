export type ItemType = "folder" | "file";

export interface FSItem {
  id: string;
  name: string;
  type: ItemType;
  parentId: string | null;
  content?: string;
  createdAt: number;
  updatedAt: number;
}

export type ItemsMap = Record<string, FSItem>;
