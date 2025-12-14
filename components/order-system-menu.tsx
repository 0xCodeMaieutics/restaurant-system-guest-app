"use client";

import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";

interface PriceOption {
  value: number;
  description?: string;
}

interface MenuItemData {
  name: string;
  description: string;
  image?: string;
  priceInEuro: PriceOption[];
}

type MenuData = Record<string, MenuItemData[]>;

function createSectionId(title: string): string {
  return title.toLowerCase().replace(/\s+/g, "-");
}

function MenuItem({
  item,
  sectionName,
}: {
  item: MenuItemData;
  sectionName: string;
}) {
  const { items, addItem, updateQuantity, removeItem } = useCart();

  // For items with multiple prices, we'll use the first price by default
  // Users can add the same item multiple times with different prices
  const handleAddItem = (priceIndex: number) => {
    const priceOption = item.priceInEuro[priceIndex];
    const itemId = `${sectionName}-${item.name}-${priceIndex}`;

    addItem({
      id: itemId,
      name: item.name,
      description: item.description,
      image: item.image,
      price: priceOption.value,
      priceDescription: priceOption.description,
      sectionName,
    });
  };

  const handleRemoveItem = (priceIndex: number) => {
    const itemId = `${sectionName}-${item.name}-${priceIndex}`;
    const cartItem = items.find((i) => i.id === itemId);

    if (cartItem) {
      if (cartItem.quantity === 1) {
        removeItem(itemId);
      } else {
        updateQuantity(itemId, cartItem.quantity - 1);
      }
    }
  };

  const getQuantity = (priceIndex: number) => {
    const itemId = `${sectionName}-${item.name}-${priceIndex}`;
    const cartItem = items.find((i) => i.id === itemId);
    return cartItem?.quantity || 0;
  };

  return (
    <div className="group border-b border-border pb-4 last:border-b-0 last:pb-0 space-y-2">
      <div className="flex items-center gap-4">
        {item.image && (
          <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden border border-border/50 bg-muted/30 group-hover:border-primary/50 transition-colors">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="96px"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {item.name}
          </h3>
          {item.description && (
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {item.priceInEuro.map((price, priceIndex) => {
          const quantity = getQuantity(priceIndex);
          return (
            <div
              key={priceIndex}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2">
                <span className="block font-semibold text-foreground">
                  {price.value.toFixed(price.value % 1 === 0 ? 0 : 2)} €
                </span>
                {price.description && (
                  <span className="block text-xs text-muted-foreground">
                    ({price.description})
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {quantity > 0 && (
                  <>
                    <Button
                      className="rounded-full"
                      size="icon-sm"
                      variant="outline"
                      onClick={() => handleRemoveItem(priceIndex)}
                      aria-label={`${item.name} reduzieren`}
                    >
                      <Minus className="size-4" />
                    </Button>
                    <span className="text-sm font-medium min-w-[24px] text-center">
                      {quantity}
                    </span>
                  </>
                )}
                <Button
                  className="rounded-full"
                  size="icon-sm"
                  variant="default"
                  onClick={() => handleAddItem(priceIndex)}
                  aria-label={`${item.name} hinzufügen`}
                >
                  <Plus className="size-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MenuSection({
  title,
  items,
  id,
  sectionName,
}: {
  title: string;
  items: MenuItemData[];
  id: string;
  sectionName: string;
}) {
  return (
    <section id={id} className="space-y-6 scroll-mt-24">
      <div className="border-b-2 border-primary/20 pb-2">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">
          {title}
        </h2>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">
          Keine Einträge verfügbar.
        </p>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <MenuItem
              key={`${item.name}-${index}`}
              item={item}
              sectionName={sectionName}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export function OrderSystemMenu({ menu }: { menu: MenuData }) {
  return (
    <div className="space-y-16">
      {Object.entries(menu).map(([sectionTitle, items]) => {
        const sectionId = createSectionId(sectionTitle);
        return (
          <MenuSection
            key={sectionTitle}
            id={sectionId}
            title={sectionTitle}
            items={items}
            sectionName={sectionTitle}
          />
        );
      })}
    </div>
  );
}
