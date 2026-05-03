import { NextRequest } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/withAuth";
import { ok, created, badRequest, serverError } from "@/lib/response";
import { parsePagination } from "@/lib/utils";

const createSchema = z.object({
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  image_url: z.string().url("Invalid image URL"),
  category: z.string().optional().nullable(),
  is_published: z.boolean().default(true),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, limit, offset } = parsePagination(searchParams);
    const category = searchParams.get("category") ?? "";

    let query = supabase
      .from("gallery_photos")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (category) query = query.eq("category", category);

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
    const result = createSchema.safeParse(body);
    if (!result.success) return badRequest(result.error.errors[0].message);

    const { data, error } = await supabase
      .from("gallery_photos")
      .insert(result.data)
      .select()
      .single();

    if (error) return serverError(error.message);
    return created(data);
  } catch {
    return serverError();
  }
});
