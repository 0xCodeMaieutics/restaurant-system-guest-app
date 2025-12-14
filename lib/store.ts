import type { Table, TablesStore, Order, OrderStatus } from "./types";

// Fixed tables - adjust as needed for your restaurant
const tables: TablesStore = {
  1: { status: "FREE", reservedBy: null },
  2: { status: "FREE", reservedBy: null },
  3: { status: "FREE", reservedBy: null },
  4: { status: "FREE", reservedBy: null },
  5: { status: "FREE", reservedBy: null },
  6: { status: "FREE", reservedBy: null },
  7: { status: "FREE", reservedBy: null },
  8: { status: "FREE", reservedBy: null },
  9: { status: "FREE", reservedBy: null },
  10: { status: "FREE", reservedBy: null },
};

class Store {
  private tables: TablesStore;
  private sseConnections: Map<number, ReadableStreamDefaultController[]> =
    new Map();

  constructor() {
    // Initialize all tables with FREE status
    this.tables = { ...tables };
  }

  private isValidTableId(tableId: number): boolean {
    return tableId in tables;
  }

  private validateTableId(tableId: number): void {
    if (!this.isValidTableId(tableId)) {
      throw new Error(
        `Invalid table ID: ${tableId}. Valid tables are: ${Object.keys(
          tables
        ).join(", ")}`
      );
    }
  }

  getTable(tableId: number): Table | undefined {
    this.validateTableId(tableId);
    return this.tables[tableId];
  }

  getAllTables(): Array<{ tableId: number; table: Table }> {
    return Object.entries(this.tables).map(([tableId, table]) => ({
      tableId: Number(tableId),
      table,
    }));
  }

  reserveTable(tableId: number, name: string): void {
    this.validateTableId(tableId);
    this.tables[tableId] = {
      ...this.tables[tableId],
      status: "RESERVED",
      reservedBy: name,
    };
  }

  createOrder(
    tableId: number,
    name: string,
    itemId: string,
    menuItems: Array<{
      id: string;
      name: string;
      description: string;
      price: number;
    }>
  ): Order {
    this.validateTableId(tableId);
    const item = menuItems.find((item) => item.id === itemId);
    if (!item) {
      throw new Error("Menu item not found");
    }

    const order: Order = {
      id: crypto.randomUUID(),
      tableId,
      name,
      item: {
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
      },
      status: "ORDER_RECEIVED",
      createdAt: new Date(),
    };

    // Ensure table is reserved
    if (this.tables[tableId].status !== "RESERVED") {
      this.tables[tableId] = {
        ...this.tables[tableId],
        status: "RESERVED",
        reservedBy: name,
      };
    }

    this.tables[tableId] = {
      ...this.tables[tableId],
      order,
    };

    // Broadcast order update via SSE
    this.broadcastToTable(tableId, order);

    return order;
  }

  updateOrderStatus(tableId: number, status: OrderStatus): void {
    this.validateTableId(tableId);
    const table = this.tables[tableId];
    if (!table || !table.order) {
      throw new Error("Order not found");
    }

    table.order = {
      ...table.order,
      status,
    };

    // Broadcast order update via SSE
    this.broadcastToTable(tableId, table.order);
  }

  freeTable(tableId: number): void {
    this.validateTableId(tableId);
    this.tables[tableId] = {
      status: "FREE",
      reservedBy: null,
      order: undefined,
    };
  }

  addSSEConnection(
    tableId: number,
    controller: ReadableStreamDefaultController
  ): void {
    this.validateTableId(tableId);
    if (!this.sseConnections.has(tableId)) {
      this.sseConnections.set(tableId, []);
    }
    this.sseConnections.get(tableId)!.push(controller);
  }

  removeSSEConnection(
    tableId: number,
    controller: ReadableStreamDefaultController
  ): void {
    this.validateTableId(tableId);
    const connections = this.sseConnections.get(tableId);
    if (connections) {
      const index = connections.indexOf(controller);
      if (index > -1) {
        connections.splice(index, 1);
      }
      if (connections.length === 0) {
        this.sseConnections.delete(tableId);
      }
    }
  }

  broadcastToTable(tableId: number, order: Order): void {
    this.validateTableId(tableId);
    const connections = this.sseConnections.get(tableId);
    if (connections) {
      const message = `data: ${JSON.stringify(order)}\n\n`;
      connections.forEach((controller) => {
        try {
          controller.enqueue(new TextEncoder().encode(message));
        } catch (error) {
          // Connection closed, remove it
          this.removeSSEConnection(tableId, controller);
        }
      });
    }
  }

  getTableNumbers(): readonly number[] {
    return Object.keys(tables).map(Number) as readonly number[];
  }
}

// Prevent store reset during Next.js hot module reload in development
// Store the instance in globalThis which persists across HMR
const globalForStore = globalThis as unknown as {
  store: Store | undefined;
};

export const store =
  globalForStore.store ?? (globalForStore.store = new Store());
