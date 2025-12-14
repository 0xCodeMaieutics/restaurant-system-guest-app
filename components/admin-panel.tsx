"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Table, TableStatus, OrderStatus } from "@/lib/types";
import { updateOrderStatus } from "@/actions/update-order-status";
import { freeTable } from "@/actions/free-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface AdminPanelProps {
  initialTables: Array<{ tableId: number; table: Table }>;
}

export function AdminPanel({ initialTables }: AdminPanelProps) {
  const router = useRouter();

  const [orderStatuses, setOrderStatuses] = useState<
    Record<number, OrderStatus>
  >(() => {
    const statuses: Record<number, OrderStatus> = {};
    initialTables.forEach(({ tableId, table }) => {
      if (table.order) {
        statuses[tableId] = table.order.status;
      }
    });
    return statuses;
  });

  const getStatusLabel = (status: TableStatus) => {
    return status === "FREE" ? "Frei" : "Reserviert";
  };

  const getStatusClassName = (status: TableStatus) => {
    return status === "FREE"
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      : "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
  };


  const getOrderStatusLabel = (status: OrderStatus) => {
    const statusMap: Record<OrderStatus, string> = {
      IDLE: "Leerlauf",
      ORDER_RECEIVED: "Erhalten",
      ORDER_PREPARING: "In Zubereitung",
      ORDER_ON_THEY_WAY_TO_TABLE: "Unterwegs",
      ORDER_SERVED: "Serviert",
    };
    return statusMap[status] || status;
  };

  const getOrderStatusClassName = (status: OrderStatus) => {
    const statusMap: Record<OrderStatus, string> = {
      IDLE: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
      ORDER_RECEIVED:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      ORDER_PREPARING:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      ORDER_ON_THEY_WAY_TO_TABLE:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      ORDER_SERVED:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    };
    return (
      statusMap[status] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    );
  };

  const handleOrderStatusChange = async (
    tableId: number,
    newStatus: OrderStatus
  ) => {
    setOrderStatuses((prev) => ({
      ...prev,
      [tableId]: newStatus,
    }));
    const result = await updateOrderStatus(tableId, newStatus);
    if (!result.success) {
      setOrderStatuses((prev) => {
        const updated = { ...prev };
        delete updated[tableId];
        return updated;
      });
      console.error("Failed to update order status:", result.error);
    }
  };

  const handleResetTable = async (tableId: number) => {
    const result = await freeTable(tableId);
    if (result.success) {
      setOrderStatuses((prev) => {
        const updated = { ...prev };
        delete updated[tableId];
        return updated;
      });
      // Refresh to get updated table data
      router.refresh();
    } else {
      console.error("Failed to reset table:", result.error);
    }
  };

  if (initialTables.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">
            Keine Tische vorhanden. Tische werden automatisch erstellt, wenn
            Gäste sie reservieren.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {initialTables.map(({ tableId, table }) => (
        <Card key={tableId} className="relative flex flex-col min-h-44">
          <CardHeader className="">
            <div className="flex items-center justify-between">
              <CardTitle
                className={cn({
                  "absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2":
                    table.reservedBy === null,
                })}
              >
                T-{tableId}
              </CardTitle>
              <Badge
                className={cn(
                  "absolute top-3 right-3",
                  getStatusClassName(table.status)
                )}
              >
                {getStatusLabel(table.status)}
              </Badge>
            </div>
            {table.reservedBy && (
              <CardDescription className="text-xs">
                Reserviert von: {table.reservedBy}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className={cn("space-y-4")}>
            {table.order && (
              <div className="space-y-2">
                <span className="text-sm block">Bestell-status:</span>
                <Select
                  value={orderStatuses[tableId] || table.order.status}
                  onValueChange={(value) =>
                    handleOrderStatusChange(tableId, value as OrderStatus)
                  }
                >
                  <SelectTrigger
                    className={`w-fit rounded-full border-0 px-3 py-1 text-sm font-medium shadow-none ${getOrderStatusClassName(
                      orderStatuses[tableId] || table.order.status
                    )}`}
                    size="sm"
                  >
                    <SelectValue>
                      {getOrderStatusLabel(
                        orderStatuses[tableId] || table.order.status
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ORDER_RECEIVED">Erhalten</SelectItem>
                    <SelectItem value="ORDER_PREPARING">
                      In Zubereitung
                    </SelectItem>
                    <SelectItem value="ORDER_ON_THEY_WAY_TO_TABLE">
                      Unterwegs
                    </SelectItem>
                    <SelectItem value="ORDER_SERVED">Serviert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            {!table.order && table.reservedBy ? (
              <span className="text-muted-foreground text-sm block">
                Noch keine Bestellung...
              </span>
            ) : null}
            {table.reservedBy ? (
              <div className="space-y-2">
                {table.order && <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push(`/admin/tables/${tableId}`)}
                >
                  Details anzeigen
                </Button>}
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => handleResetTable(tableId)}
                >
                  Tisch freigeben
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
