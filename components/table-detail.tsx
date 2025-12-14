"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Table, OrderStatus } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { updateOrderStatus } from "@/actions/update-order-status";
import { freeTable } from "@/actions/free-table";
import { ArrowRight, User, Clock, ChefHat, Truck, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TableDetailProps {
  tableId: number;
  initialTable: Table;
}

export function TableDetail({ tableId, initialTable }: TableDetailProps) {
  const router = useRouter();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  const handleUpdateOrderStatus = async (status: OrderStatus) => {
    const result = await updateOrderStatus(tableId, status);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error);
    }
  };

  const handleFreeTable = async () => {
    if (
      !confirm(
        "Möchten Sie diesen Tisch wirklich freigeben? Dies entfernt die Reservierung und alle Bestellungen."
      )
    ) {
      return;
    }

    const result = await freeTable(tableId);
    if (result.success) {
      router.push("/admin/tables");
    } else {
      alert(result.error);
    }
  };

  const getOrderStatusLabel = (status: string): string => {
    const statusMap: Record<string, string> = {
      ORDER_RECEIVED: "Erhalten",
      ORDER_PREPARING: "In Zubereitung",
      ORDER_ON_THEY_WAY_TO_TABLE: "Unterwegs",
      ORDER_SERVED: "Serviert",
    };
    return statusMap[status] || status;
  };

  const getAllOrderStatuses = (): OrderStatus[] => {
    return [
      "ORDER_RECEIVED",
      "ORDER_PREPARING",
      "ORDER_ON_THEY_WAY_TO_TABLE",
      "ORDER_SERVED",
    ];
  };

  const getOrderStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "ORDER_RECEIVED":
        return <Clock className="w-4 h-4" />;
      case "ORDER_PREPARING":
        return <ChefHat className="w-4 h-4" />;
      case "ORDER_ON_THEY_WAY_TO_TABLE":
        return <Truck className="w-4 h-4" />;
      case "ORDER_SERVED":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation with Reserved By Info */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-base text-muted-foreground">
          <Link
            href="/admin/tables"
            className="hover:text-foreground transition-colors font-semibold underline"
          >
            Tische
          </Link>
          <ArrowRight className="w-4 h-4" />
          <span className="text-foreground font-semibold">Tisch {tableId}</span>
        </div>
        {initialTable.reservedBy && (
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Reserviert von:</span>
            <span className="font-semibold text-foreground">{initialTable.reservedBy}</span>
          </div>
        )}
      </div>

      {initialTable.order ? (
        <div className="space-y-6">
          {/* Order Status Card - Prominent */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-xl">Aktuelle Bestellung</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Order Item Details */}
              <div>
                {initialTable.order.item.image && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100 border">
                    <Image
                      src={initialTable.order.item.image}
                      alt={initialTable.order.item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="space-y-4 w-full">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Gericht
                    </p>
                    <p className="text-2xl font-bold">
                      {initialTable.order.item.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Beschreibung
                    </p>
                    <p className="text-base leading-relaxed">
                      {initialTable.order.item.description}
                    </p>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Preis
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {formatPrice(initialTable.order.item.price)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Status Update Section */}
              <div className="pt-4 border-t space-y-3">
                <p className="text-sm font-semibold text-foreground">
                  Bestellstatus:
                </p>
                <div className="flex flex-wrap gap-2">
                  {getAllOrderStatuses().map((status) => {
                    const isCurrent = status === initialTable.order!.status;
                    return (
                      <Button
                        key={status}
                        size="lg"
                        variant={isCurrent ? "default" : "outline"}
                        className={cn(
                          "flex items-center gap-2",
                          isCurrent && "bg-primary text-primary-foreground hover:bg-primary/90"
                        )}
                        onClick={() => !isCurrent && handleUpdateOrderStatus(status)}
                        disabled={isCurrent}
                      >
                        {getOrderStatusIcon(status)}
                        {getOrderStatusLabel(status)}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  variant="destructive"
                  size="lg"
                  className="w-full max-w-xs"
                  onClick={handleFreeTable}
                >
                  Tisch freigeben
                </Button>
              </div>

            </CardContent>
          </Card>
        </div>
      ) : (
        /* No Order State */
        <Card>
          <CardContent className="py-12 space-y-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                <ChefHat className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">
                  Keine aktive Bestellung
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Dieser Tisch hat noch keine Bestellung erhalten
                </p>
              </div>
            </div>
            {initialTable.status === "RESERVED" && (
              <div className="pt-4 border-t">
                <Button
                  variant="destructive"
                  size="lg"
                  className="w-full"
                  onClick={handleFreeTable}
                >
                  Tisch freigeben
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )
      }
    </div >
  );
}