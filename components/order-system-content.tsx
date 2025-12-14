"use client";

import { useCart, OrderStatus } from "@/lib/cart-context";
import { MenuNavigation } from "@/components/menu-navigation";
import { Cart, MobileCart } from "@/components/cart";
import { OrderSystemMenu } from "@/components/order-system-menu";
import { OrderSubmitted } from "@/components/order-submitted";

type MenuData = Record<string, any[]>;

interface OrderSystemContentProps {
  menu: MenuData;
  sections: string[];
}

export function OrderSystemContent({
  menu,
  sections,
}: OrderSystemContentProps) {
  const { orderStatus } = useCart();

  if (orderStatus === OrderStatus.ORDER_SUBMITTED) {
    return <OrderSubmitted />;
  }

  return (
    <div className="min-h-screen bg-background">
      <MenuNavigation sections={sections} />
      <div className="container mx-auto px-4 pt-44 pb-12 max-w-7xl">
        <div className="flex gap-8">
          <div className="flex-1 max-w-4xl">
            <OrderSystemMenu menu={menu} />
          </div>
          <div className="hidden lg:block">
            <Cart />
          </div>
        </div>
      </div>
      {/* Mobile cart */}
      <MobileCart />
    </div>
  );
}
