import { NextRequest } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/withAuth";
import { ok, badRequest, conflict, notFound, serverError } from "@/lib/response";

const updateSchema = z.object({
  slug: z.string().optional(),
  badge: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  month: z.string().optional(),
  audience: z.string().optional(),
  cover: z.string().url().optional(),
  hero: z.string().url().optional(),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  highlights: z.array(z.string()).optional(),
  is_published: z.boolean().optional(),
  sort_order: z.number().int().optional(),
});

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;
    const { data, error } = await supabase.from("resources").select("*").eq("id", id).single();
    if (error || !data) return notFound("Resource not found");
    return ok(data);
  } catch {
    return serverError();
  }
}

export const PUT = withAuth(async (request, { params }) => {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = updateSchema.safeParse(body);
    if (!result.success) return badRequest(result.error.errors[0].message);

    const { data, error } = await supabase
      .from("resources")
      .update({ ...result.data, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "23505") return conflict("Slug already exists.");
      return serverError(error.message);
    }
    if (!data) return notFound("Resource not found");
    return ok(data);
  } catch {
    return serverError();
  }
});

export const DELETE = withAuth(async (_request, { params }) => {
  try {
    const { id } = await params;
    const { error } = await supabase.from("resources").delete().eq("id", id);
    if (error) return serverError(error.message);
    return ok({ message: "Resource deleted successfully" });
  } catch {
    return serverError();
  }
});
