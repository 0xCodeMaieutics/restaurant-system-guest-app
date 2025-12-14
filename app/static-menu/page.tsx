import { MenuNavigation } from "@/components/menu-navigation";
import Image from "next/image";
import { readFile } from "fs/promises";
import { join } from "path";

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

function MenuItem({ item }: { item: MenuItemData }) {
  return (
    <div className="group border-b border-border pb-4 last:border-b-0 last:pb-0">
      {/* Mobile: Keep original layout */}
      <div className="flex items-start gap-4 md:hidden">
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
        <div className="flex-1 min-w-0 flex items-start justify-between gap-4">
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
          <div className="flex flex-col items-end gap-1 shrink-0">
            {item.priceInEuro.map((price, priceIndex) => (
              <div key={priceIndex} className="text-right">
                <span className="font-semibold text-foreground">
                  {price.value.toFixed(price.value % 1 === 0 ? 0 : 2)} €
                </span>
                {price.description && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {price.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop: Image-first layout */}
      <div className="hidden md:flex gap-6">
        {item.image && (
          <div className="relative w-64 h-64 lg:w-80 lg:h-80 shrink-0 rounded-xl overflow-hidden border border-border/50 bg-muted/30 group-hover:border-primary/50 transition-colors shadow-sm group-hover:shadow-md">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(min-width: 1024px) 320px, 256px"
              priority={false}
            />
          </div>
        )}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-2">
          <div className="flex-1">
            <h3 className="font-semibold text-lg lg:text-xl text-foreground group-hover:text-primary transition-colors mb-2">
              {item.name}
            </h3>
            {item.description && (
              <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-1 mt-4 shrink-0">
            {item.priceInEuro.map((price, priceIndex) => (
              <div key={priceIndex} className="text-right">
                <span className="font-semibold text-lg lg:text-xl text-foreground">
                  {price.value.toFixed(price.value % 1 === 0 ? 0 : 2)} €
                </span>
                {price.description && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {price.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MenuSection({
  title,
  items,
  id,
}: {
  title: string;
  items: MenuItemData[];
  id: string;
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
            <MenuItem key={`${item.name}-${index}`} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}

export default async function StaticMenuPage() {
  const filePath = join(process.cwd(), "public", "menu-items.json");
  const fileContents = await readFile(filePath, "utf8");
  const menu = JSON.parse(fileContents) as MenuData;
  const sections = Object.keys(menu);

  return (
    <div className="min-h-screen bg-background">
      <MenuNavigation sections={sections} />
      <div className="container mx-auto px-4 pt-44 pb-12 max-w-4xl">
        <div className="space-y-16">
          {Object.entries(menu).map(([sectionTitle, items]) => {
            const sectionId = createSectionId(sectionTitle);
            return (
              <MenuSection
                key={sectionTitle}
                id={sectionId}
                title={sectionTitle}
                items={items}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
