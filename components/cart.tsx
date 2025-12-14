"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Minus, Plus, ShoppingCart, X } from "lucide-react";
import Image from "next/image";

export function Cart() {
  const {
    items,
    updateQuantity,
    removeItem,
    getTotalPrice,
    getTotalItems,
    clearCart,
    submitOrder,
  } = useCart();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  if (totalItems === 0) {
    return (
      <Card className="hidden lg:block sticky top-24 w-full max-w-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="size-5" />
            Warenkorb
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Ihr Warenkorb ist leer
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hidden lg:flex sticky top-24 w-full max-w-sm max-h-[calc(100vh-8rem)] lg:flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="size-5" />
            Warenkorb ({totalItems})
          </CardTitle>
          {items.length > 0 && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={clearCart}
              aria-label="Warenkorb leeren"
              className="h-8 w-8"
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto py-4">
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-3 pb-4 border-b last:border-b-0 last:pb-0"
            >
              {item.image && (
                <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-border/50 bg-muted/30">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-foreground truncate">
                      {item.name}
                    </h4>
                    {item.priceDescription && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.priceDescription}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeItem(item.id)}
                    aria-label={`${item.name} entfernen`}
                    className="h-6 w-6 shrink-0"
                  >
                    <X className="size-3" />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label={`${item.name} reduzieren`}
                      className="h-7 w-7 rounded-full"
                    >
                      <Minus className="size-3" />
                    </Button>
                    <span className="text-sm font-medium w-6 text-center">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label={`${item.name} erhöhen`}
                      className="h-7 w-7 rounded-full"
                    >
                      <Plus className="size-3" />
                    </Button>
                  </div>
                  <span className="font-semibold text-sm">
                    {(item.price * item.quantity).toFixed(
                      item.price % 1 === 0 ? 0 : 2
                    )}{" "}
                    €
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <div className="border-t px-6 py-4 bg-muted/30">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-semibold">Gesamt:</span>
          <span className="text-xl font-bold">
            {totalPrice.toFixed(totalPrice % 1 === 0 ? 0 : 2)} €
          </span>
        </div>
        <Button className="w-full" size="lg" onClick={submitOrder}>
          Bestellen
        </Button>
      </div>
    </Card>
  );
}

export function MobileCart() {
  const [open, setOpen] = useState(false);
  const {
    items,
    updateQuantity,
    removeItem,
    getTotalPrice,
    getTotalItems,
    submitOrder,
  } = useCart();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  if (totalItems === 0) {
    return null;
  }

  // Show small cart button when closed
  if (!open) {
    return (
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setOpen(true)}
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg relative"
          aria-label="Warenkorb öffnen"
        >
          <ShoppingCart className="size-5" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center border-2 border-background">
              {totalItems > 99 ? "99+" : totalItems}
            </span>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
      <Card className="w-full max-h-[70vh] flex flex-col shadow-lg border-t-2 border-primary/20">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="size-5" />
              Warenkorb ({totalItems})
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setOpen(false)}
                aria-label="Warenkorb schließen"
                className="h-8 w-8"
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto py-4">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 pb-4 border-b last:border-b-0 last:pb-0"
              >
                {item.image && (
                  <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-border/50 bg-muted/30">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-foreground truncate">
                        {item.name}
                      </h4>
                      {item.priceDescription && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.priceDescription}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeItem(item.id)}
                      aria-label={`${item.name} entfernen`}
                      className="h-6 w-6 shrink-0"
                    >
                      <X className="size-3" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        aria-label={`${item.name} reduzieren`}
                        className="h-7 w-7 rounded-full"
                      >
                        <Minus className="size-3" />
                      </Button>
                      <span className="text-sm font-medium w-6 text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        aria-label={`${item.name} erhöhen`}
                        className="h-7 w-7 rounded-full"
                      >
                        <Plus className="size-3" />
                      </Button>
                    </div>
                    <span className="font-semibold text-sm">
                      {(item.price * item.quantity).toFixed(
                        item.price % 1 === 0 ? 0 : 2
                      )}{" "}
                      €
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <div className="border-t px-6 py-4 bg-muted/30">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold">Gesamt:</span>
            <span className="text-xl font-bold">
              {totalPrice.toFixed(totalPrice % 1 === 0 ? 0 : 2)} €
            </span>
          </div>
          <Button className="w-full" size="lg" onClick={submitOrder}>
            Bestellen
          </Button>
        </div>
      </Card>
    </div>
  );
}
