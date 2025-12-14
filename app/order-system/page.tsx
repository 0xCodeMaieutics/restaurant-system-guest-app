import { CartProvider } from "@/lib/cart-context";
import { OrderSystemContent } from "@/components/order-system-content";
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

export default async function OrderSystemPage() {
  const filePath = join(process.cwd(), "public", "menu-items.json");
  const fileContents = await readFile(filePath, "utf8");
  const menu = JSON.parse(fileContents) as MenuData;
  const sections = Object.keys(menu);

  return (
    <CartProvider>
      <OrderSystemContent menu={menu} sections={sections} />
    </CartProvider>
  );
}
