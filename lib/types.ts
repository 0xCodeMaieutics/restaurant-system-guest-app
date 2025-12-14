export type TableStatus = "FREE" | "RESERVED";

export type OrderStatus =
  | "IDLE"
  | "ORDER_RECEIVED"
  | "ORDER_PREPARING"
  | "ORDER_ON_THEY_WAY_TO_TABLE"
  | "ORDER_SERVED";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
}

export interface Order {
  id: string;
  tableId: number;
  name: string;
  item: MenuItem;
  status: OrderStatus;
  createdAt: Date;
}

export interface Table {
  status: TableStatus;
  reservedBy: string | null;
  order?: Order;
}

export type TablesStore = Record<number, Table>;

