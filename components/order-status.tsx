"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Order, OrderStatus } from "@/lib/types";

interface OrderStatusProps {
  tableId: number;
  initialOrder: Order;
}

const statusMessages: Record<OrderStatus, string> = {
  IDLE: "",
  ORDER_RECEIVED: "6 Minuten. Vor dir sind noch 3 Bestellungen",
  ORDER_PREPARING: "Dein Essen ist bald fertig",
  ORDER_ON_THEY_WAY_TO_TABLE: "Dein Essen ist auf dem Weg",
  ORDER_SERVED: "Dein Essen wurde serviert",
};

const statusLabels: Record<OrderStatus, string> = {
  IDLE: "Leerlauf",
  ORDER_RECEIVED: "Bestellung erhalten",
  ORDER_PREPARING: "Wird zubereitet",
  ORDER_ON_THEY_WAY_TO_TABLE: "Auf dem Weg zum Tisch",
  ORDER_SERVED: "Serviert",
};

const statusColors: Record<OrderStatus, { text: string; bg: string }> = {
  IDLE: { text: "text-gray-600", bg: "bg-gray-100" },
  ORDER_RECEIVED: { text: "text-blue-700", bg: "bg-blue-100" },
  ORDER_PREPARING: { text: "text-orange-700", bg: "bg-orange-100" },
  ORDER_ON_THEY_WAY_TO_TABLE: { text: "text-green-700", bg: "bg-green-100" },
  ORDER_SERVED: { text: "text-green-800", bg: "bg-green-200" },
};

export function OrderStatus({ tableId, initialOrder }: OrderStatusProps) {
  const [order, setOrder] = useState<Order>(initialOrder);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const eventSource = new EventSource(`/api/order-status?tableId=${tableId}`);

    eventSource.onopen = () => {
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const updatedOrder: Order = JSON.parse(event.data);
        setOrder(updatedOrder);
      } catch (error) {
        console.error("Fehler beim Parsen der SSE-Nachricht:", error);
      }
    };

    eventSource.onerror = () => {
      setIsConnected(false);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [tableId]);

  const statusMessage = statusMessages[order.status] || "";
  const statusColor = statusColors[order.status] || {
    text: "text-gray-600",
    bg: "bg-gray-100",
  };

  if (order.status === "ORDER_SERVED") {
    return (
      <div className="h-dvh flex items-center justify-center p-4">
        <div className="relative size-92">
          <Image src="/pay-qr-code.webp" alt="QR Code" fill />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Bestellstatus</CardTitle>
          <CardDescription>
            {order.item.name} - {order.item.price.toFixed(2)} €
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Status:</p>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${statusColor.text} ${statusColor.bg}`}
              >
                {statusLabels[order.status] ||
                  order.status.replace(/_/g, " ").toLowerCase()}
              </span>
            </div>
            {statusMessage && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Nachricht:</p>
                <p className="text-base">{statusMessage}</p>
              </div>
            )}
            <div className="pt-2">
              <p className="text-xs text-muted-foreground">
                {isConnected ? "✓ Verbunden" : "Verbindung wird hergestellt..."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
