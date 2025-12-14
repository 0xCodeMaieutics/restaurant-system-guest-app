import { MenuItem } from "./menu-item";

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

interface MenuListProps {
  items: MenuItemData[];
}

export function MenuList({ items }: MenuListProps) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground italic">Keine Einträge verfügbar.</p>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <MenuItem key={`${item.name}-${index}`} item={item} />
      ))}
    </div>
  );
}
