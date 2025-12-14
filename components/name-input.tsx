"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { reserveTable } from "@/actions/reserve-table";

interface NameInputProps {
  tableId: number;
}

export function NameInput({ tableId }: NameInputProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Bitte geben Sie Ihren Namen ein.");
      return;
    }

    startTransition(async () => {
      const result = await reserveTable(tableId, name.trim());

      if (!result.success) {
        setError(result.error);
      } else {
        router.refresh();
      }
    });
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Tisch reservieren</h1>
      <p className="text-muted-foreground mb-6">
        Bitte geben Sie Ihren Namen ein, um den Tisch zu reservieren.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="text"
            placeholder="Ihr Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isPending}
            className="w-full"
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button size={'lg'} type="submit" disabled={isPending} className="w-full">
          {isPending ? "Wird reserviert..." : "Tisch reservieren"}
        </Button>
      </form>
    </div>
  );
}
