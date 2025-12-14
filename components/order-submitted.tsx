"use client";

import { useCart } from "@/lib/cart-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export function OrderSubmitted() {
  const { orderNumber } = useCart();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="size-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Bestellung abgeschickt!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div>
            <p className="text-muted-foreground mb-2">
              Ihre Bestellnummer:
            </p>
            <p className="text-3xl font-bold text-primary">
              {orderNumber}
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            Ihre Bestellung wurde erfolgreich übermittelt. Bitte behalten Sie
            diese Bestellnummer für Ihre Referenz.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
