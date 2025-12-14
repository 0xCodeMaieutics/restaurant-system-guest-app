import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full h-dvh flex items-center justify-center">
      <div className="grid grid-cols-4 gap-4 max-w-2xl">
        {Array.from({ length: 20 }, (_, i) => i + 1).map((tableNumber) => (
          <Button key={tableNumber} asChild variant={"link"}>
            <Link href={`/tables/${tableNumber}`}>
              Geh zu Tisch {tableNumber}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
