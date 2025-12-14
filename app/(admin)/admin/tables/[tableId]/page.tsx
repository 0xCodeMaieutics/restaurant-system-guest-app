import { store } from "@/lib/store";
import { TableDetail } from "@/components/table-detail";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface TableDetailPageProps {
  params: Promise<{ tableId: string }>;
}

export default async function TableDetailPage({
  params,
}: TableDetailPageProps) {
  const { tableId } = await params;
  const tableIdNumber = parseInt(tableId, 10);

  if (isNaN(tableIdNumber)) {
    notFound();
  }

  const table = store.getTable(tableIdNumber);

  if (!table) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <TableDetail tableId={tableIdNumber} initialTable={table} />
    </div>
  );
}
