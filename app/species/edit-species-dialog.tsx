"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { createBrowserSupabaseClient } from "@/lib/client-utils";
import type { Database } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { speciesSchema } from "./add-species-dialog";

type Species = Database["public"]["Tables"]["species"]["Row"];
type FormData = z.infer<typeof speciesSchema>;

export default function EditSpeciesDialog({ species }: { species: Species }) {
  const supabase = createBrowserSupabaseClient();
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(speciesSchema),
    defaultValues: {
      scientific_name: species.scientific_name ?? "",
      common_name: species.common_name ?? "",
      kingdom: species.kingdom ?? "",
      total_population: species.total_population ?? undefined,
      description: species.description ?? "",
      image: species.image ?? "",
    },
  });

  const onSubmit = async (input: FormData) => {
    const cleanInput = {
      scientific_name: input.scientific_name,
      common_name: input.common_name?.trim() === "" ? null : input.common_name?.trim() ?? null,
      kingdom: input.kingdom?.trim() === "" ? undefined : (input.kingdom as Species["kingdom"]),
      total_population: input.total_population ?? null,
      description: input.description?.trim() === "" ? null : input.description?.trim() ?? null,
      image: input.image?.trim() === "" ? null : input.image?.trim() ?? null,
    };

    const { data, error } = await supabase.from("species").update(cleanInput).eq("id", species.id).select();

    if (error) {
      console.error("Update failed:", error);
      return toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    }

    console.log("Updated species:", data);

    toast({
      title: "Species updated",
      description: `${cleanInput.scientific_name} has been updated.`,
    });

    router.refresh();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="mt-2 w-full">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit {species.scientific_name}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="scientific_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scientific Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Panthera leo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="common_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Common Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Lion" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="kingdom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kingdom</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full rounded-md border p-2"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value === "" ? undefined : e.target.value)}
                    >
                      <option value="">Select kingdom</option>
                      <option value="Animalia">Animalia</option>
                      <option value="Plantae">Plantae</option>
                      <option value="Fungi">Fungi</option>
                      <option value="Protista">Protista</option>
                      <option value="Archaea">Archaea</option>
                      <option value="Bacteria">Bacteria</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="total_population"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Population</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g. 20000"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value, 10) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Description" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Save Changes
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
