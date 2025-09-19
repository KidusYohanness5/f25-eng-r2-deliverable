"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Database } from "@/lib/schema";

type Species = Database["public"]["Tables"]["species"]["Row"];

export default function SpeciesDetailDialog({ species }: { species: Species }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-3 w-full">Learn More</Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{species.scientific_name}</DialogTitle>
          <p className="italic text-gray-600">{species.common_name}</p>
        </DialogHeader>

        <div className="space-y-3">
          <p>
            <strong>Kingdom:</strong> {species.kingdom}
          </p>
          <p>
            <strong>Total Population:</strong> {species.total_population ?? "Unknown"}
          </p>
          <p className="mt-4 whitespace-pre-line">{species.description}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
