import { NextRequest } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/withAuth";
import { ok, created, badRequest, serverError } from "@/lib/response";
import { parsePagination } from "@/lib/utils";

const createSchema = z.object({
  name: z.string().min(1, "Name is required"),
  logo_url: z.string().url("Invalid logo URL"),
  partner_type: z.enum(["corporate", "media", "community"]),
  website_url: z.string().url("Invalid website URL").optional().nullable(),
  sort_order: z.number().int().default(0),
  is_published: z.boolean().default(true),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, limit, offset } = parsePagination(searchParams);
    const partnerType = searchParams.get("partner_type") ?? "";
    const search = searchParams.get("search") ?? "";

    let query = supabase
      .from("partners")
      .select("*", { count: "exact" })
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true })
      .range(offset, offset + limit - 1);

    if (partnerType) query = query.eq("partner_type", partnerType);
    if (search) query = query.ilike("name", `%${search}%`);

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
      .from("partners")
      .insert(result.data)
      .select()
      .single();

    if (error) return serverError(error.message);
    return created(data);
  } catch {
    return serverError();
  }
});
