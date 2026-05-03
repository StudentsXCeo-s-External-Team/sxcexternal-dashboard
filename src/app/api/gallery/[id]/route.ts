import { NextRequest } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/withAuth";
import { ok, badRequest, notFound, serverError } from "@/lib/response";

const updateSchema = z.object({
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  image_url: z.string().url("Invalid image URL").optional(),
  category: z.string().optional().nullable(),
  is_published: z.boolean().optional(),
});

type Context = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Context) {
  const { id } = await params;
  const { data, error } = await supabase
    .from("gallery_photos")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return notFound("Photo not found");
  return ok(data);
}

export const PUT = withAuth(async (request, { params }) => {
  const { id } = await params;
  const body = await request.json();
  const result = updateSchema.safeParse(body);
  if (!result.success) return badRequest(result.error.errors[0].message);

  const { data, error } = await supabase
    .from("gallery_photos")
    .update(result.data)
    .eq("id", id)
    .select()
    .single();

  if (error) return serverError(error.message);
  return ok(data);
});

export const DELETE = withAuth(async (_request, { params }) => {
  const { id } = await params;
  const { error } = await supabase.from("gallery_photos").delete().eq("id", id);
  if (error) return serverError(error.message);
  return ok({ deleted: true });
});
