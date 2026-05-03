import { NextRequest } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/withAuth";
import { ok, created, badRequest, serverError } from "@/lib/response";
import { parsePagination } from "@/lib/utils";

const createSchema = z.object({
  name: z.string().min(1, "Name is required"),
  position: z.string().optional().nullable(),
  photo_url: z.string().url("Invalid photo URL").optional().nullable(),
  period: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  sort_order: z.number().int().default(0),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, limit, offset } = parsePagination(searchParams);
    const period = searchParams.get("period") ?? "";

    let query = supabase
      .from("members")
      .select("*", { count: "exact" })
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true })
      .range(offset, offset + limit - 1);

    if (period) query = query.eq("period", period);

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
      .from("members")
      .insert(result.data)
      .select()
      .single();

    if (error) return serverError(error.message);
    return created(data);
  } catch {
    return serverError();
  }
});
