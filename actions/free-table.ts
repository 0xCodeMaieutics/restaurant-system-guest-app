"use server";

import { store } from "@/lib/store";

export async function freeTable(
  tableId: number
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    store.freeTable(tableId);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Ein Fehler ist aufgetreten.",
    };
  }
}
