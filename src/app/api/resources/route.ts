import { NextRequest } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/withAuth";
import { getServerAdmin } from "@/lib/server-auth";
import { ok, created, badRequest, conflict, serverError } from "@/lib/response";
import { generateSlug, parsePagination } from "@/lib/utils";

const createSchema = z.object({
  slug: z.string().optional(),
  badge: z.string().min(1, "Badge is required"),
  category: z.string().min(1, "Category is required"),
  title: z.string().min(1, "Title is required"),
  month: z.string().min(1, "Month is required"),
  audience: z.string().min(1, "Audience is required"),
  cover: z.string().url("Invalid cover URL"),
  hero: z.string().url("Invalid hero URL"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  highlights: z.array(z.string()).optional().default([]),
  is_published: z.boolean().default(true),
  sort_order: z.number().int().default(0),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, limit, offset } = parsePagination(searchParams);
    const search = searchParams.get("search") ?? "";
    const slug = searchParams.get("slug") ?? "";

    const admin = await getServerAdmin();

    let query = supabase
      .from("resources")
      .select("*", { count: "exact" })
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (!admin) query = query.eq("is_published", true);
    if (slug) query = query.eq("slug", slug);
    else if (search) query = query.ilike("title", `%${search}%`);

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

    const payload = {
      ...result.data,
      slug: result.data.slug ?? generateSlug(result.data.badge),
    };

    const { data, error } = await supabase
      .from("resources")
      .insert(payload)
      .select()
      .single();

    if (error) {
      if (error.code === "23505") return conflict("Slug already exists.");
      return serverError(error.message);
    }
    return created(data);
  } catch {
    return serverError();
  }
});
