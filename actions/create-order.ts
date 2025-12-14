"use server";

import { store } from "@/lib/store";
import { menuItems } from "@/lib/menu-data";
import type { Order } from "@/lib/types";

export async function createOrder(
  tableId: number,
  name: string,
  itemId: string
): Promise<
  { success: true; order?: Order } | { success: false; error: string }
> {
  try {
    const table = store.getTable(tableId);

    // If table exists and is reserved by a different name, return error
    if (table && table.status === "RESERVED" && table.reservedBy !== name) {
      return {
        success: false,
        error: "Dieser Tisch ist bereits von einem anderen Gast reserviert.",
      };
    }

    // If no itemId provided, just reserve the table (don't create order)
    if (!itemId) {
      return { success: true };
    }

    // Create order
    const order = store.createOrder(tableId, name, itemId, menuItems);

    return { success: true, order };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Ein Fehler ist aufgetreten.",
    };
  }
}
