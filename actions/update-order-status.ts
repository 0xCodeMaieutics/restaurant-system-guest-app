"use server";

import { store } from "@/lib/store";
import type { OrderStatus } from "@/lib/types";

export async function updateOrderStatus(
  tableId: number,
  status: OrderStatus
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    store.updateOrderStatus(tableId, status);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Ein Fehler ist aufgetreten.",
    };
  }
}
