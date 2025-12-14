import { store } from "@/lib/store";
import { AdminPanel } from "@/components/admin-panel";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  const tables = store.getAllTables();

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminPanel initialTables={tables} />
    </div>
  );
}
