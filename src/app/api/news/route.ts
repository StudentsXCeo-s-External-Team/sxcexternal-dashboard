import { NextRequest } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/withAuth";
import { ok, created, badRequest, conflict, serverError } from "@/lib/response";
import { generateSlug, parsePagination } from "@/lib/utils";

const createNewsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  image_url: z.string().url("Invalid image URL").optional().nullable(),
  author: z.string().optional().nullable(),
  slug: z.string().optional(),
  is_published: z.boolean().default(true),
  published_at: z.string().datetime().optional().nullable(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, limit, offset } = parsePagination(searchParams);
    const search = searchParams.get("search") ?? "";

    let query = supabase
      .from("news")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (search) {
      query = query.ilike("title", `%${search}%`);
    }

    const { data, error, count } = await query;
    if (error) return serverError(error.message);

    return ok(data, {
      page,
      limit,
      total: count ?? 0,
      totalPages: Math.ceil((count ?? 0) / limit),
    });
  } catch {
    return serverError();
  }
}

export const POST = withAuth(async (request) => {
  try {
    const body = await request.json();
    const result = createNewsSchema.safeParse(body);
    if (!result.success) {
      return badRequest(result.error.errors[0].message);
    }

    const payload = {
      ...result.data,
      slug: result.data.slug ?? generateSlug(result.data.title),
      published_at:
        result.data.published_at ??
        (result.data.is_published ? new Date().toISOString() : null),
    };

    const { data, error } = await supabase
      .from("news")
      .insert(payload)
      .select()
      .single();

    if (error) {
      if (error.code === "23505") return conflict("Slug already exists. Provide a custom slug.");
      return serverError(error.message);
    }

    return created(data);
  } catch {
    return serverError();
  }
});
