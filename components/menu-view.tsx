"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createOrder } from "@/actions/create-order";
import { menuItems } from "@/lib/menu-data";

interface MenuViewProps {
  tableId: number;
  name: string;
}

export function MenuView({ tableId, name }: MenuViewProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [orderingItemId, setOrderingItemId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleOrder = (itemId: string) => {
    setOrderingItemId(itemId);
    setError(null);
    startTransition(async () => {
      const result = await createOrder(tableId, name, itemId);
      if (result.success) {
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <div className="container pt-8">
      <h1 className="text-2xl font-bold mb-2">Speisekarte</h1>
      <p className="text-muted-foreground mb-6">
        Hallo {name}, wählen Sie ein Gericht aus.
      </p>
      {error && (
        <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {menuItems.map((item) => (
          <Card key={item.id} className="pt-0">
            {item.image && (
              <div className="relative w-full h-48">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover rounded-t-lg"
                />
              </div>
            )}
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">{item.price.toFixed(2)} €</p>
            </CardContent>
            <CardFooter>
              <Button
                size={"lg"}
                onClick={() => handleOrder(item.id)}
                disabled={isPending || orderingItemId === item.id}
                className="w-full"
              >
                {isPending && orderingItemId === item.id
                  ? "Wird bestellt..."
                  : "Bestellen"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
