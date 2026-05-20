import { NextRequest } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/withAuth";
import { getServerAdmin } from "@/lib/server-auth";
import { ok, created, badRequest, serverError } from "@/lib/response";
import { parsePagination } from "@/lib/utils";

const createEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().nullable(),
  image_url: z.string().url("Invalid image URL").optional().nullable(),
  start_date: z.string().datetime("Invalid start_date format"),
  end_date: z.string().datetime("Invalid end_date format").optional().nullable(),
  location: z.string().optional().nullable(),
  registration_url: z.string().url("Invalid registration URL").optional().nullable(),
  is_published: z.boolean().default(true),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, limit, offset } = parsePagination(searchParams);
    const search = searchParams.get("search") ?? "";

    // Authenticated admins see all events; public only sees published
    const admin = await getServerAdmin();

    let query = supabase
      .from("events")
      .select("*", { count: "exact" })
      .order("start_date", { ascending: false })
      .range(offset, offset + limit - 1);

    if (!admin) {
      query = query.eq("is_published", true);
    }

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
    const result = createEventSchema.safeParse(body);
    if (!result.success) {
      return badRequest(result.error.errors[0].message);
    }

    const { data, error } = await supabase
      .from("events")
      .insert(result.data)
      .select()
      .single();

    if (error) return serverError(error.message);
    return created(data);
  } catch {
    return serverError();
  }
});
