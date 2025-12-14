import { notFound } from "next/navigation";
import { store } from "@/lib/store";
import { NameInput } from "@/components/name-input";
import { MenuView } from "@/components/menu-view";
import { OrderStatus } from "@/components/order-status";

interface TablePageProps {
  params: Promise<{
    tableNumber: string;
  }>;
}

export default async function TablePage({ params }: TablePageProps) {
  const { tableNumber } = await params;
  const tableId = parseInt(tableNumber, 10);

  // Validate table number
  if (isNaN(tableId) || tableId <= 0) {
    notFound();
  }

  // Validate table exists (getTable throws if invalid)
  let table: ReturnType<typeof store.getTable>;
  try {
    table = store.getTable(tableId);
  } catch {
    notFound();
  }

  // If table doesn't exist or is FREE, show name input
  if (!table || table.status === "FREE") {
    return (
      <div className="h-dvh flex items-center justify-center p-4">
        <NameInput tableId={tableId} />
      </div>
    );
  }

  // If table is reserved but no order exists, show menu
  if (table.status === "RESERVED" && !table.order) {
    return (
      <div className="h-dvh p-4">
        <MenuView tableId={tableId} name={table.reservedBy || ""} />
      </div>
    );
  }

  // If order exists, show order status
  if (table.order) {
    return (
      <div className="h-dvh flex items-center justify-center p-4">
        <OrderStatus tableId={tableId} initialOrder={table.order} />
      </div>
    );
  }

  // Fallback (shouldn't happen)
  return (
    <div className="h-dvh flex items-center justify-center p-4">
      <p>Unerwarteter Fehler</p>
    </div>
  );
}
