"use server";

import { store } from "@/lib/store";

export async function reserveTable(
  tableId: number,
  name: string
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const table = store.getTable(tableId);

    // If table exists and is reserved by a different name, return error
    if (table && table.status === "RESERVED") {
      return {
        success: false,
        error: "Dieser Tisch ist bereits von einem anderen Gast reserviert.",
      };
    }

    store.reserveTable(tableId, name);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Ein Fehler ist aufgetreten.",
    };
  }
}
