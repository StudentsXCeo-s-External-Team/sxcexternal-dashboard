import { NextRequest } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/withAuth";
import { ok, badRequest, conflict, notFound, serverError } from "@/lib/response";

const updateNewsSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  image_url: z.string().url().optional().nullable(),
  author: z.string().optional().nullable(),
  slug: z.string().optional(),
  images: z.array(z.string().url()).optional(),
  is_published: z.boolean().optional(),
  published_at: z.string().datetime().optional().nullable(),
});

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return notFound("News not found");
    return ok(data);
  } catch {
    return serverError();
  }
}

export const PUT = withAuth(async (request, { params }) => {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = updateNewsSchema.safeParse(body);
    if (!result.success) {
      return badRequest(result.error.errors[0].message);
    }

    const updates: Record<string, unknown> = {
      ...result.data,
      updated_at: new Date().toISOString(),
    };

    // Auto-set published_at when publishing for the first time
    if (result.data.is_published && !result.data.published_at) {
      const { data: existing } = await supabase
        .from("news")
        .select("published_at, is_published")
        .eq("id", id)
        .single();

      if (existing && !existing.is_published && !existing.published_at) {
        updates.published_at = new Date().toISOString();
      }
    }

    const { data, error } = await supabase
      .from("news")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "23505") return conflict("Slug already exists.");
      return serverError(error.message);
    }
    if (!data) return notFound("News not found");
    return ok(data);
  } catch {
    return serverError();
  }
});

export const DELETE = withAuth(async (_request, { params }) => {
  try {
    const { id } = await params;
    const { error } = await supabase.from("news").delete().eq("id", id);
    if (error) return serverError(error.message);
    return ok({ message: "News deleted successfully" });
  } catch {
    return serverError();
  }
});
