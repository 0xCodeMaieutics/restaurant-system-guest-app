import { MenuList } from "./menu-list";

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

interface MenuSectionProps {
  title: string;
  items: MenuItemData[];
  id?: string;
}

export function MenuSection({ title, items, id }: MenuSectionProps) {
  return (
    <section id={id} className="space-y-6 scroll-mt-24">
      <div className="border-b-2 border-primary/20 pb-2">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">
          {title}
        </h2>
      </div>
      <MenuList items={items} />
    </section>
  );
}
