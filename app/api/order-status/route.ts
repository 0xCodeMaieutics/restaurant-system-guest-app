import { NextRequest } from "next/server";
import { store } from "@/lib/store";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const tableIdParam = searchParams.get("tableId");

  if (!tableIdParam) {
    return new Response("tableId parameter is required", { status: 400 });
  }

  const tableId = parseInt(tableIdParam, 10);
  if (isNaN(tableId)) {
    return new Response("Invalid tableId", { status: 400 });
  }

  // Validate table exists (getTable throws if invalid)
  let table: ReturnType<typeof store.getTable>;
  try {
    table = store.getTable(tableId);
  } catch {
    return new Response("Invalid tableId", { status: 400 });
  }

  if (!table || !table.order) {
    return new Response("Order not found", { status: 404 });
  }

  // Create a ReadableStream for SSE
  const stream = new ReadableStream({
    start(controller) {
      // Add this connection to the store
      store.addSSEConnection(tableId, controller);

      // Send initial order status
      const initialMessage = `data: ${JSON.stringify(table.order)}\n\n`;
      controller.enqueue(new TextEncoder().encode(initialMessage));

      // Keep connection alive with periodic ping
      const pingInterval = setInterval(() => {
        try {
          controller.enqueue(new TextEncoder().encode(`: ping\n\n`));
        } catch (error) {
          clearInterval(pingInterval);
          store.removeSSEConnection(tableId, controller);
        }
      }, 30000); // Ping every 30 seconds

      // Cleanup on close
      request.signal.addEventListener("abort", () => {
        clearInterval(pingInterval);
        store.removeSSEConnection(tableId, controller);
        try {
          controller.close();
        } catch (error) {
          // Controller already closed
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
